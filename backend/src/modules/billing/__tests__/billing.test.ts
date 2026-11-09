import { billingService } from '../services/billing.service';
import { prisma } from '../../../config/prisma';

// Mock do prisma
jest.mock('../../../config/prisma', () => ({
  prisma: {
    salon: {
      update: jest.fn(),
    },
  },
}));

describe('Billing Service - Webhooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve liberar o acesso (ACTIVE) quando receber webhook de pagamento', async () => {
    const mockId = 'mock-salon-123';
    
    await billingService.processWebhook('payment', mockId);

    expect(prisma.salon.update).toHaveBeenCalledWith({
      where: { id: '123' },
      data: {
        subscriptionStatus: 'ACTIVE',
        isBlocked: false,
      },
    });
  });

  it('deve travar o acesso (PAST_DUE) quando receber webhook de falha', async () => {
    const mockId = 'mock-salon-456';
    
    await billingService.processWebhook('payment_failed', mockId);

    expect(prisma.salon.update).toHaveBeenCalledWith({
      where: { id: '456' },
      data: {
        subscriptionStatus: 'PAST_DUE',
        isBlocked: true,
      },
    });
  });
  
  it('não deve fazer nada se o ID não começar com mock-salon-', async () => {
    const realId = 'real-id-789';
    
    await billingService.processWebhook('payment', realId);

    expect(prisma.salon.update).not.toHaveBeenCalled();
  });
});
