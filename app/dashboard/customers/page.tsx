import Table from "@/app/ui/customers/table";
import { lusitana } from "@/app/ui/fonts";
import { Suspense } from "react";
import { fetchCustomerPages, fetchCustomers, fetchFilteredCustomers } from '@/app/lib/data';
import { FormattedCustomersTable } from "@/app/lib/definitions";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import Search from "@/app/ui/search";
import { CreateButton } from "@/app/ui/buttons";
import Pagination from "@/app/ui/pagination";


export default async function Page({searchParams}: {searchParams?: {query?: string; page?: string;};}) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    const totalPages = await fetchCustomerPages(query);
    const customers = await fetchFilteredCustomers(query, currentPage);
    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Customers</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search customers..." />
                <CreateButton href='/dashboard/customers/create' title="Create Customer"/>
            </div>
            <Suspense fallback={<InvoicesTableSkeleton />}>
                <Table customers={customers}/>
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={Number(totalPages)} />
            </div>
        </div>
    );
}