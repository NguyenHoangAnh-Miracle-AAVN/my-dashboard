'use server';
import { z } from 'zod';
import {sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {signIn} from '@/auth';
import { AuthError } from 'next-auth';
import { Customer } from './definitions';


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

const CustomerSchema = z.object({
    id: z.string(),
    name: z.string().nonempty({
        message: 'Please enter a name.',
    }),
    email: z.string().email().refine((email) => email.length < 255 && email.includes('@'),{
        message: 'Please enter a valid email address.',
    }),
    image_url: z.string().refine((url) => url.length < 255, {
        message: 'Please enter a valid URL.',
    }),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true});
const UpdateInvoice = FormSchema.omit({id: true, date: true});
const CreateCustomer = CustomerSchema.omit({id: true});
const UpdateCustomer = CustomerSchema.omit({id: true});

export type State = {
    errors? : {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
}

export type CustomerState = {
    errors?: {
        name?: string[];
        email?: string[];
        image_url?: string[];
    };
    message?: string | null;
}
export async function updateCustomer(id: string, prevState: CustomerState, formData: FormData) {
    const validateFields = UpdateCustomer.safeParse(Object.fromEntries(formData.entries()));
    if (!validateFields.success) {
        return {
            errors: validateFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to update customer.',
        }
    }
    const {name, email, image_url} = validateFields.data;
    try {
        await sql`UPDATE customers SET name = ${name}, email = ${email}, image_url = ${image_url} WHERE id = ${id}`;
    } catch (error) {
        return {
            message: 'Database Error: Failed to update customer.',
        };
    }

    revalidatePath('dashboard/customers');
    redirect('/dashboard/customers');
}

export async function createCustomer(prevState: CustomerState, formData: FormData) {
    const validatedFields = CreateCustomer.safeParse(Object.fromEntries(formData.entries()));
    // console.log('----------- validatedFields:', validatedFields.error.flatten().fieldErrors);
    if (!validatedFields.success) {
        console.log('----------- validatedFields:', validatedFields);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to create customer.',
        }
    }

    const {name, email, image_url} = validatedFields.data;
    try {
        await sql `INSERT INTO customers (name, email, image_url) VALUES (${name}, ${email}, ${image_url})`;
    } catch (error) {
        return {
            message: 'Database Error: Failed to create customer.',
        };
    }

    revalidatePath('dashboard/customers');
    redirect('/dashboard/customers');
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

export async function deleteCustomer(id: string) {
    try {
        await sql`DELETE FROM customers WHERE id = ${id}`;
    } catch (error) {
        return {message: 'Database Error: Failed to delete customer.',};
    }
    revalidatePath('dashboard/customers');
    redirect('/dashboard/customers');
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
    
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalic credentials.';
                default:
                    return 'Something went wrong.'
            }
        }
        throw error;
    }
}