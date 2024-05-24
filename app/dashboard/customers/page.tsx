import { fetchCustomerPages, fetchFilteredCustomers } from '@/app/lib/data';
import { CreateButton } from "@/app/ui/buttons";
import CreatedCount from '@/app/ui/customers/created-count';
import Table from "@/app/ui/customers/table";
import ToastNotifier from '@/app/ui/customers/toast-notifier';
import { lusitana } from "@/app/ui/fonts";
import Pagination from "@/app/ui/pagination";
import Search from "@/app/ui/search";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default async function Page({searchParams}: {searchParams?: {query?: string; page?: string;};}) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    const totalPages = await fetchCustomerPages(query);
    const customers = await fetchFilteredCustomers(query, currentPage);
    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Customers</h1>
                <ToastContainer/>
                <CreatedCount/>
                <ToastNotifier/>
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