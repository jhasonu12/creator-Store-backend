import { AnalyticsEvent } from '@models/AnalyticsEvent';
import { Sequelize, Op } from 'sequelize';
import { logger } from '@common/utils/logger';

/**
 * Analytics Service
 * Tracks user events asynchronously without blocking main request flow
 */
export class AnalyticsService {
  /**
   * Track event asynchronously
   * Does not await - fire and forget to avoid blocking requests
   */
  static trackEvent(
    eventType: string,
    options?: {
      userId?: string;
      creatorId?: string;
      productId?: string;
      metadata?: Record<string, any>;
      ipAddress?: string;
      userAgent?: string;
    }
  ): void {
    // Fire and forget - don't await
    this.trackEventAsync(eventType, options).catch((error) => {
      logger.error('Analytics event tracking error', { eventType, error });
    });
  }

  /**
   * Internal async method for event tracking
   */
  private static async trackEventAsync(
    eventType: string,
    options?: {
      userId?: string;
      creatorId?: string;
      productId?: string;
      metadata?: Record<string, any>;
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<void> {
    try {
      const event = await AnalyticsEvent.create({
        eventType,
        userId: options?.userId || null,
        creatorId: options?.creatorId || null,
        productId: options?.productId || null,
        metadata: options?.metadata || {},
        ipAddress: options?.ipAddress || null,
        userAgent: options?.userAgent || null,
      });

      logger.debug('Analytics event tracked', {
        eventId: event.id,
        eventType,
        userId: options?.userId,
      });
    } catch (error) {
      logger.error('Failed to track analytics event', {
        eventType,
        error,
      });
      // Don't re-throw - analytics failures should not affect main app
    }
  }

  /**
   * Get events for creator dashboard
   */
  static async getCreatorEvents(
    creatorId: string,
    options?: {
      eventType?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    }
  ): Promise<{ events: AnalyticsEvent[]; total: number }> {
    const where: any = { creatorId };

    if (options?.eventType) {
      where.eventType = options.eventType;
    }

    if (options?.startDate || options?.endDate) {
      where.createdAt = {};
      if (options.startDate) {
        where.createdAt[Op.gte] = options.startDate;
      }
      if (options.endDate) {
        where.createdAt[Op.lte] = options.endDate;
      }
    }

    const events = await AnalyticsEvent.findAll({
      where,
      limit: options?.limit || 100,
      offset: options?.offset || 0,
      order: [['createdAt', 'DESC']],
    });

    const total = await AnalyticsEvent.count({ where });

    return { events, total };
  }

  /**
   * Get events for a product
   */
  static async getProductEvents(
    productId: string,
    options?: {
      eventType?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<{ events: AnalyticsEvent[]; total: number }> {
    const where: any = { productId };

    if (options?.eventType) {
      where.eventType = options.eventType;
    }

    const events = await AnalyticsEvent.findAll({
      where,
      limit: options?.limit || 100,
      offset: options?.offset || 0,
      order: [['createdAt', 'DESC']],
    });

    const total = await AnalyticsEvent.count({ where });

    return { events, total };
  }

  /**
   * Get aggregated event counts
   */
  static async getEventCounts(
    options?: {
      creatorId?: string;
      productId?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<Record<string, number>> {
    const where: any = {};

    if (options?.creatorId) {
      where.creatorId = options.creatorId;
    }
    if (options?.productId) {
      where.productId = options.productId;
    }
    if (options?.startDate || options?.endDate) {
      where.createdAt = {};
      if (options.startDate) {
        where.createdAt[Op.gte] = options.startDate;
      }
      if (options.endDate) {
        where.createdAt[Op.lte] = options.endDate;
      }
    }

    const events = await AnalyticsEvent.findAll({
      attributes: ['eventType', [Sequelize.fn('COUNT', Sequelize.col('*')), 'count']],
      where,
      group: ['eventType'],
      raw: true,
    });

    const counts: Record<string, number> = {};
    events.forEach((event: any) => {
      counts[event.eventType] = parseInt(event.count, 10);
    });

    return counts;
  }
}


