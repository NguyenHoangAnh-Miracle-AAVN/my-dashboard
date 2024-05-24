import { fetchCustomerById } from "@/app/lib/data";
import EditCustomerForm from "@/app/ui/customers/edit-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import {notFound} from 'next/navigation';

export default async function page({ params }: { params: { id: string; }; }){
    const id = params.id;
    const customer = await fetchCustomerById(params.id);
    if (!customer) {
        notFound();
    }
    console.log('----------- customer:', customer);
    return (
        <main>
          <Breadcrumbs
            breadcrumbs={[
              {
                label: 'Customers',
                href: 'dashboard/customers',
              },
              {
                label: 'Edit Customer',
                href: `dashboard/customers/${id}/edit`,
                active: true,
              },
            ]}
          />
          <EditCustomerForm customer={customer}/>
        </main>
      );
}
