import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { analytics_events, investment_options } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const SPOTLIGHT_QUIZ_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get spotlight view events
    const viewEvents = await db()
      .select({
        event_type: analytics_events.event_type,
        data: analytics_events.data,
        timestamp: analytics_events.timestamp
      })
      .from(analytics_events)
      .where(
        and(
          eq(analytics_events.quiz_id, SPOTLIGHT_QUIZ_ID),
          eq(analytics_events.event_type, 'SPOTLIGHT_VIEW'),
          sql`${analytics_events.timestamp} >= ${startDate.toISOString()}`
        )
      );

    // Get spotlight click events
    const clickEvents = await db()
      .select({
        event_type: analytics_events.event_type,
        data: analytics_events.data,
        timestamp: analytics_events.timestamp
      })
      .from(analytics_events)
      .where(
        and(
          eq(analytics_events.quiz_id, SPOTLIGHT_QUIZ_ID),
          eq(analytics_events.event_type, 'SPOTLIGHT_CLICK'),
          sql`${analytics_events.timestamp} >= ${startDate.toISOString()}`
        )
      );

    // Get investment options for reference
    const investmentOptions = await db()
      .select({
        id: investment_options.id,
        title: investment_options.title,
        company_name: investment_options.company_name
      })
      .from(investment_options);

    // Create a map for easy lookup
    const optionsMap = new Map(
      investmentOptions.map(opt => [opt.id, { title: opt.title, companyName: opt.company_name }])
    );

    // Process click data to get counts per investment
    const clickCounts: Record<string, { count: number; title: string; companyName: string }> = {};
    
    clickEvents.forEach(event => {
      const data = event.data as any;
      const investmentId = data?.investmentId;
      
      if (investmentId) {
        if (!clickCounts[investmentId]) {
          const optionInfo = optionsMap.get(investmentId) || { title: 'Unknown', companyName: 'Unknown' };
          clickCounts[investmentId] = {
            count: 0,
            title: optionInfo.title,
            companyName: optionInfo.companyName
          };
        }
        clickCounts[investmentId].count++;
      }
    });

    // Calculate conversion rate
    const totalViews = viewEvents.length;
    const totalClicks = clickEvents.length;
    const conversionRate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;

    // Sort by click count
    const sortedClickCounts = Object.entries(clickCounts)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalViews,
          totalClicks,
          conversionRate: Number(conversionRate.toFixed(2)),
          dateRange: {
            start: startDate.toISOString(),
            end: new Date().toISOString()
          }
        },
        clicksByInvestment: sortedClickCounts,
        rawEvents: {
          views: viewEvents.length,
          clicks: clickEvents.length
        }
      }
    });

  } catch (error) {
    console.error('Error fetching spotlight analytics:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
