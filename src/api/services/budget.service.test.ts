import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as budgetService from './budget.service.ts';
import { prisma } from '../lib/prisma.js';

vi.mock('../lib/prisma.js', () => ({
  prisma: {
    budget: {
      create: vi.fn(),
    },
    transaction: {
      aggregate: vi.fn(),
    },
    alert: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe('Budget Service - checkAndCreateRetroactiveAlert', () => {
  const userId = 1;
  const budget = {
    id: 10,
    limit_amount: 100,
    id_category: 1,
    month: 5,
    year: 2026,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not create an alert if total expenses are below limit', async () => {
    (prisma.transaction.aggregate as any).mockResolvedValue({
      _sum: { amount: 80 },
    });

    const result = await budgetService.checkAndCreateRetroactiveAlert(userId, budget);

    expect(result.alreadyExceeded).toBe(false);
    expect(result.total).toBe(80);
    expect(prisma.alert.create).not.toHaveBeenCalled();
  });

  it('should create an alert if total expenses exceed limit', async () => {
    (prisma.transaction.aggregate as any).mockResolvedValue({
      _sum: { amount: 150 },
    });
    (prisma.alert.findFirst as any).mockResolvedValue(null);

    const result = await budgetService.checkAndCreateRetroactiveAlert(userId, budget);

    expect(result.alreadyExceeded).toBe(true);
    expect(result.total).toBe(150);
    expect(prisma.alert.create).toHaveBeenCalledWith({
      data: {
        userId,
        categoryId: budget.id_category,
        exceededAmount: 50,
        isRead: false,
      },
    });
  });

  it('should update an existing alert if it already exists', async () => {
    (prisma.transaction.aggregate as any).mockResolvedValue({
      _sum: { amount: 150 },
    });
    const existingAlert = { id: 1, isRead: true };
    (prisma.alert.findFirst as any).mockResolvedValue(existingAlert);

    const result = await budgetService.checkAndCreateRetroactiveAlert(userId, budget);

    expect(result.alreadyExceeded).toBe(true);
    expect(prisma.alert.update).toHaveBeenCalledWith({
      where: { id: existingAlert.id },
      data: { isRead: false, exceededAmount: 50 },
    });
    expect(prisma.alert.create).not.toHaveBeenCalled();
  });

  it('should consider total equal to limit as exceeded', async () => {
    (prisma.transaction.aggregate as any).mockResolvedValue({
      _sum: { amount: 100 },
    });
    (prisma.alert.findFirst as any).mockResolvedValue(null);

    const result = await budgetService.checkAndCreateRetroactiveAlert(userId, budget);

    expect(result.alreadyExceeded).toBe(true);
    expect(result.total).toBe(100);
    expect(prisma.alert.create).toHaveBeenCalled();
  });
});
