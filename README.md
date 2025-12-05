# Welcome to Next.js Optimized Package Repository
# for [Chargily Pay](https://chargily.com/business/pay "Chargily Pay")™ Gateway - V2.

Thank you for your interest in the Next.js optimized package of Chargily Pay™, an open source project by Chargily, a leading fintech company in Algeria specializing in payment solutions and e-commerce facilitating. This package provides the easiest and free way to integrate e-payment API through widespread payment methods in Algeria such as EDAHABIA (Algerie Post) and CIB (SATIM) into your Next.js projects.

**IMPORTANT: This package is optimized for Next.js and uses Server Components and Server Actions. It must be used on the server-side only.**

This package is developed by **Rauf ([ruzolut](https://github.com/ruzolut))** and edited for NextJS by **Djallil ([DjallilElk](https://github.com/DjallilElk))**  is open to contributions from developers like you.


## Key Features

- Easy integration with Chargily Pay e-payment gateway
- Support for both EDAHABIA of Algerie Poste and CIB of SATIM
- Comprehensive management of customers, products, and prices
- Efficient handling of checkouts and payment links
- Optimized for Next.js 13+ with App Router
- Built-in support for Server Components and Server Actions
- Type-safe with full TypeScript support
- Support for webhooks in Next.js API Routes

## Installation

To include this library in your project, you can use npm or yarn:

```shell
npm install @chargily/chargily-pay
```

or

```shell
yarn add @chargily/chargily-pay
```

## Getting Started

Before utilizing the library, you must configure it with your [Chargily API key](https://dev.chargily.com/pay-v2/api-keys) and specify the mode (test or live). 

### Using with Next.js Server Actions

```ts
'use server';

import { ChargilyClient } from '@chargily/chargily-pay';

const client = new ChargilyClient({
  api_key: process.env.CHARGILY_API_KEY!,
  mode: 'test', // Change to 'live' when deploying your application
});

export async function createCheckoutAction(items: any[]) {
  const checkout = await client.createCheckout({
    items,
    success_url: 'https://yourdomain.com/success',
    failure_url: 'https://yourdomain.com/failure',
  });
  return checkout;
}
```

### Using with Next.js API Routes

```ts
// app/api/chargily/route.ts
import { ChargilyClient } from '@chargily/chargily-pay';
import { NextRequest, NextResponse } from 'next/server';

const client = new ChargilyClient({
  api_key: process.env.CHARGILY_API_KEY!,
  mode: 'test',
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const checkout = await client.createCheckout(body);
  return NextResponse.json(checkout);
}
```

This initializes the Chargily client, ready for communication with the Chargily Pay API.

## Webhooks with Next.js

**Important Notice:**

Webhooks allow your application to react to events from Chargily Pay by receiving HTTP requests with JSON payloads. In Next.js, you should implement webhooks using API Routes to ensure proper verification and processing of webhook events.

When implementing webhooks:

1. **Verify the Signature:** Ensure the request is legitimate and untampered.
2. **Identify the Event:** Use the event type to determine the action.
3. **Handle the Event:** Execute the necessary actions based on the event type.
4. **Respond with 200:** Confirm receipt of the webhook.

### Example Webhook with Next.js API Route

Create a webhook endpoint at `app/api/webhook/route.ts`:

```ts
import { verifySignature } from '@chargily/chargily-pay';
import { NextRequest, NextResponse } from 'next/server';

const API_SECRET_KEY = process.env.CHARGILY_API_KEY!;

export async function POST(request: NextRequest) {
  const signature = request.headers.get('signature') || '';
  
  if (!signature) {
    console.log('Signature header is missing');
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  // Get raw body as buffer
  const body = await request.arrayBuffer();
  const payload = Buffer.from(body);

  try {
    if (!verifySignature(payload, signature, API_SECRET_KEY)) {
      console.log('Signature is invalid');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }
  } catch (error) {
    console.log('Error processing webhook:', error);
    return NextResponse.json({ error: 'Processing error' }, { status: 403 });
  }

  // Parse the event
  const event = JSON.parse(payload.toString());
  
  // Handle the event based on type
  console.log('Webhook event:', event);
  
  // Implement your business logic here based on event.type
  
  return NextResponse.json({ received: true }, { status: 200 });
}
```

### Testing Webhooks Locally

To test webhooks locally with Next.js, use [NGROK](https://ngrok.com):

```shell
ngrok http 3000
```

Ngrok will return a public endpoint that you can add to Chargily's dashboard at [https://pay.chargily.com/test/dashboard/developers-corner](https://pay.chargily.com/test/dashboard/developers-corner). Make sure to append `/api/webhook` to your ngrok URL.

## Creating a Customer

To create a customer in a Next.js Server Action:

```ts
'use server';

import { ChargilyClient } from '@chargily/chargily-pay';

const client = new ChargilyClient({
  api_key: process.env.CHARGILY_API_KEY!,
  mode: 'test',
});

export async function createCustomerAction() {
  const customerData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+213xxxxxxxx',
    address: {
      country: 'DZ',
      state: 'Algiers',
      address: '123 Main St',
    },
    metadata: {
      notes: 'Important customer',
    },
  };

  const customer = await client.createCustomer(customerData);
  return customer;
}
```

This method returns a promise with the created customer object.

## Updating a Customer

To update an existing customer in a Server Action:

```ts
'use server';

export async function updateCustomerAction(customerId: string) {
  const updateData = {
    email: 'new.email@example.com',
    metadata: { notes: 'Updated customer info' },
  };

  const customer = await client.updateCustomer(customerId, updateData);
  return customer;
}
```

This will update the specified fields of the customer and return the updated customer object.

## Creating a Product

To create a new product in a Server Action:

```ts
'use server';

export async function createProductAction() {
  const productData = {
    name: 'Super Product',
    description: 'An amazing product that does everything!',
    images: ['http://example.com/image1.jpg', 'http://example.com/image2.jpg'],
    metadata: { category: 'electronics' },
  };

  const product = await client.createProduct(productData);
  return product;
}
```

This method requires the `name` of the product and optionally accepts `description`, an array of `images`, and `metadata`.

## Deleting a Customer

To delete a customer in a Server Action:

```ts
'use server';

export async function deleteCustomerAction(customerId: string) {
  const response = await client.deleteCustomer(customerId);
  return response;
}
```

This method will return a response indicating whether the deletion was successful.

## Listing Customers

You can list all customers with optional pagination in a Server Component or Server Action:

```ts
'use server';

export async function listCustomersAction(perPage: number = 20) {
  const customersList = await client.listCustomers(perPage);
  return customersList;
}
```

The response will include a paginated list of customers along with pagination details.

## Environment Variables

For Next.js projects, store your API key in environment variables. Create a `.env.local` file:

```env
CHARGILY_API_KEY=your_api_key_here
CHARGILY_MODE=test
```

Then access it in your Server Actions or API Routes:

```ts
'use server';

import { ChargilyClient } from '@chargily/chargily-pay';

const client = new ChargilyClient({
  api_key: process.env.CHARGILY_API_KEY!,
  mode: process.env.CHARGILY_MODE as 'test' | 'live',
});
```





## Updating a Product

Update products in a Server Action:

```ts
'use server';

export async function updateProductAction(productId: string) {
  const updatedProduct = await client.updateProduct(productId, {
    name: 'Even More Awesome Product',
    description: 'An updated description',
    images: ['https://example.com/newimage.png'],
    metadata: {
      category: 'Updated Category',
    },
  });
  return updatedProduct;
}
```

This updates the product details and returns the updated product object.

## Creating a Price

Create a price in a Server Action:

```ts
'use server';

export async function createPriceAction(productId: string) {
  const newPrice = await client.createPrice({
    amount: 5000,
    currency: 'dzd',
    product_id: productId,
    metadata: {
      size: 'M',
    },
  });
  return newPrice;
}
```

This creates a new price for the specified product and returns the price object.

## Updating a Price

Update price metadata in a Server Action:

```ts
'use server';

export async function updatePriceAction(priceId: string) {
  const updatedPrice = await client.updatePrice(priceId, {
    metadata: {
      size: 'L',
    },
  });
  return updatedPrice;
}
```

This updates the price's metadata and returns the updated price object.

## Creating a Checkout

Create a checkout session in a Server Action:

```ts
'use server';

export async function createCheckoutAction(priceId: string) {
  const checkout = await client.createCheckout({
    items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: 'https://your-website.com/success',
    failure_url: 'https://your-website.com/failure',
    payment_method: 'edahabia',
    locale: 'en',
    pass_fees_to_customer: true,
    shipping_address: '123 Test St, Test City, DZ',
    collect_shipping_address: true,
    metadata: {
      order_id: '123456',
    },
  });
  return checkout;
}
```

This creates a new checkout session and returns the checkout object, including a `checkout_url` where you can redirect your customer to complete their payment.

## Creating a Payment Link

Create payment links in a Server Action:

```ts
'use server';

export async function createPaymentLinkAction(priceId: string) {
  const paymentLink = await client.createPaymentLink({
    name: 'Product Payment',
    items: [
      {
        price: priceId,
        quantity: 1,
        adjustable_quantity: false,
      },
    ],
    after_completion_message: 'Thank you for your purchase!',
    locale: 'en',
    pass_fees_to_customer: true,
    collect_shipping_address: true,
    metadata: {
      campaign: 'Summer Sale',
    },
  });
  return paymentLink;
}
```

This creates a new payment link and returns the payment link object, including the URL that you can share with your customers.



## Working with Checkouts

### Creating a Checkout

Creating a checkout is a crucial step for initiating a payment process. Use Server Actions in Next.js:

```ts
'use server';

export async function createCheckoutAction(items: any[], customerId?: string) {
  const newCheckout = await client.createCheckout({
    items: [
      { price: 'PRICE_ID', quantity: 2 },
      { price: 'ANOTHER_PRICE_ID', quantity: 1 },
    ],
    success_url: 'https://yourdomain.com/success',
    failure_url: 'https://yourdomain.com/failure',
    payment_method: 'edahabia',
    customer_id: customerId,
    metadata: { orderId: '123456' },
    locale: 'en',
    pass_fees_to_customer: false,
  });
  return newCheckout;
}
```

This request creates a new checkout session and returns the checkout object, including a `checkout_url` where you should redirect your customer to complete the payment.

### Retrieving a Checkout

To fetch details of a specific checkout session:

```ts
'use server';

export async function getCheckoutAction(checkoutId: string) {
  const checkoutDetails = await client.getCheckout(checkoutId);
  return checkoutDetails;
}
```

This retrieves the details of the specified checkout session.

## Managing Payment Links

### Creating a Payment Link

Payment Links provide a versatile way to request payments by generating a unique URL that you can share with your customers:

```ts
'use server';

export async function createPaymentLinkAction(priceId: string) {
  const paymentLink = await client.createPaymentLink({
    name: 'Subscription Service',
    items: [{ price: priceId, quantity: 1, adjustable_quantity: false }],
    after_completion_message: 'Thank you for your subscription!',
    locale: 'en',
    pass_fees_to_customer: true,
    collect_shipping_address: true,
    metadata: { subscriptionId: 'sub_12345' },
  });
  return paymentLink;
}
```

This creates a new payment link with specified details and returns the payment link object including the URL to be shared with your customers.

### Updating a Payment Link

To update an existing payment link:

```ts
'use server';

export async function updatePaymentLinkAction(paymentLinkId: string) {
  const updatedLink = await client.updatePaymentLink(paymentLinkId, {
    name: 'Updated Subscription Service',
    after_completion_message: 'Thank you for updating your subscription!',
    metadata: { subscriptionId: 'sub_67890' },
  });
  return updatedLink;
}
```

This updates the specified payment link and returns the updated object.

### Fetching a Payment Link

Retrieve the details of a specific payment link:

```ts
'use server';

export async function getPaymentLinkAction(paymentLinkId: string) {
  const linkDetails = await client.getPaymentLink(paymentLinkId);
  return linkDetails;
}
```

This call retrieves the specified payment link's details.

### Listing Payment Links

To list all your payment links:

```ts
'use server';

export async function listPaymentLinksAction() {
  const allLinks = await client.listPaymentLinks();
  return allLinks;
}
```

This returns a paginated list of all payment links you've created.


## About Chargily Pay™ packages

Chargily Pay™ packages/plugins are a collection of open source projects published by Chargily to facilitate the integration of our payment gateway into different programming languages and frameworks. Our goal is to empower developers and businesses by providing easy-to-use tools to seamlessly accept payments.

## API Documentation

For detailed instructions on how to integrate with our API and utilize Chargily Pay™ in your projects, please refer to our [API Documentation](https://dev.chargily.com/pay-v2/introduction). 

## Developers Community

Join our developer community on Telegram to connect with fellow developers, ask questions, and stay updated on the latest news and developments related to Chargily Pay™ : [Telegram Community](https://chargi.link/PayTelegramCommunity)

## How to Contribute

We welcome contributions of all kinds, whether it's bug fixes, feature enhancements, documentation improvements, or new plugin/package developments. Here's how you can get started:

1. **Fork the Repository:** Click the "Fork" button in the top-right corner of this page to create your own copy of the repository.

2. **Clone the Repository:** Clone your forked repository to your local machine using the following command:

```bash
git clone https://github.com/DjallilElk/chargily-pay-typescript-NXT/
```

3. **Make Changes:** Make your desired changes or additions to the codebase. Be sure to follow our coding standards and guidelines.

4. **Test Your Changes:** Test your changes thoroughly to ensure they work as expected.

5. **Submit a Pull Request:** Once you're satisfied with your changes, submit a pull request back to the main repository. Our team will review your contributions and provide feedback if needed.

## Get in Touch

Have questions or need assistance? Join our developer community on [Telegram](https://chargi.link/PayTelegramCommunity) and connect with fellow developers and our team.

We appreciate your interest in contributing to Chargily Pay™! Together, we can build something amazing.

Happy coding!

