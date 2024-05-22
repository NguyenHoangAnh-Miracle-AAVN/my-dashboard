'use server';
import { z } from 'zod';
import {sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.'
    }),
    amount: z.coerce.number().gt(0, {message: 'Please enter an amount greater than $0.00.'}),
    status: z.enum(['pending', 'paid'] ,{
        invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
})

const CreateInvoice = FormSchema.omit({ id: true, date: true});
const UpdateInvoice = FormSchema.omit({id: true, date: true});

export type State = {
    errors? : {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
}

export async function createInvoice(prevState: State, formData:FormData) {
    const validatedFields = CreateInvoice.safeParse(Object.fromEntries(formData.entries()));
    console.log('----------- validatedFields:', validatedFields);
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Feilds. Failed to create invoice.',
        }
    }
    
    const {customerId, amount, status} = validatedFields.data;
    const amountInCents = Math.round(amount * 100);
    const date = new Date().toISOString().split('T')[0];
    try{
        await sql `INSERT INTO invoices (customer_id, amount, status, date) VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`;
    } catch (error) {
        return {
            message: 'Database Error: Failed to create invoice.',
        };
    }

    revalidatePath('dashboard/invoices');
    redirect('/dashboard/invoices');

}

export async function updateInvoice(id:string, prevState: State, formData: FormData) {
    console.log('formData:', formData);
    console.log('UpdateInvoice:', UpdateInvoice);

    const validatedFields = UpdateInvoice.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success){
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to update invoice.',
        }
    }


    const {customerId, amount, status } = validatedFields.data;
    const amountInCents = Math.round(amount * 100);

    try {
        await sql`UPDATE invoices SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status} WHERE id = ${id}`;
    } catch (error) {
        return {
            message: 'Database Error: Failed to update invoice.',
        };
    }

    revalidatePath('dashboard/invoices');
    redirect('/dashboard/invoices');

}

export async function deleteInvoice(id: string) {
    try{
        await sql`DELETE FROM invoices WHERE id = ${id}`;
    }catch (error) {
        return {message: 'Database Error: Failed to delete invoice.',};
    }
    revalidatePath('dashboard/invoices');
    redirect('/dashboard/invoices');
}