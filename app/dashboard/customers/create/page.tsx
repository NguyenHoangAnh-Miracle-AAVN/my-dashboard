import Form from '@/app/ui/customers/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: 'Customers',
            href: '/customers',
          },
          {
            label: 'Create Customer',
            href: '/customers/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
