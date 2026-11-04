'use client';

import { useFormatter } from 'next-intl';
import { useCreateOrderForm } from '@/features/orders/components/hooks/use.create.order.form';
import OrderFormFields from '@/features/orders/components/ui/order-form-fields';

/** Presents a standalone staff order form for page or dialog containers. */
export default function CreateOrderForm({ onCreated }: { onCreated?: (number: string) => void }) {
    const state = useCreateOrderForm(onCreated);
    const format = useFormatter();
    return (
        <OrderFormFields
            state={state}
            mutation={state.mutation}
            submit={state.submit}
            showPayment
            submitLabel={
                state.plan
                    ? state.t('submitWithAmount', {
                          amount: format.number(state.plan.price, {
                              style: 'currency',
                              currency: state.plan.currency,
                              currencyDisplay: 'code',
                          }),
                      })
                    : state.t('submit')
            }
            errorMessage={state.t('error')}
        />
    );
}
