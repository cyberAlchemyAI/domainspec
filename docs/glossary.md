# Glossary

> Ubiquitous language — domain terms used consistently across documentation and code.
> When a term appears in docs, code, or conversation, it means exactly what's defined here.

## Terms

| Term                | Definition                                                                                                       | Feature(s)         | See Also                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------- |
| Payment Transaction | A single attempt to move money from a customer to the business. Tracks amount, method, fee, and lifecycle state. | Payment Processing | [domain.md](features/payment-processing/domain.md#paymenttransaction)     |
| Money               | An immutable pair of decimal amount and ISO 4217 currency code. The canonical way to express monetary values.    | Shared             | [money.md](shared/money.md)                                               |
| Payment Method      | How a customer pays — credit card, bank transfer, or digital wallet.                                             | Payment Processing | [domain.md](features/payment-processing/domain.md#paymentmethod)          |
| Payment Status      | The lifecycle state of a payment transaction (Created, Processing, Completed, Failed, etc.).                     | Payment Processing | [states.md](features/payment-processing/states.md#paymentstatus)          |
| Processing Fee      | A calculated charge added to the payment amount based on the selected payment method.                            | Payment Processing | [operations.md](features/payment-processing/operations.md#feecalculation) |
| Gateway Reference   | An external identifier from the payment gateway, assigned when a transaction is confirmed.                       | Payment Processing | [domain.md](features/payment-processing/domain.md#paymenttransaction)     |
| Retry Policy        | Decision logic that determines when and how many times a failed-retryable payment should be reattempted.         | Payment Processing | [operations.md](features/payment-processing/operations.md#retrypayment)   |
| Terminal State      | A state from which no further transitions are possible (Failed, Refunded, RefundFailed).                         | Payment Processing | [states.md](features/payment-processing/states.md#paymentstatus)          |
