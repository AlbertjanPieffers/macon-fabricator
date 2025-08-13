-- Fix critical security vulnerability: Replace overly permissive RLS policies with authentication-based access control

-- Drop the existing overly permissive policies
DROP POLICY IF EXISTS "Allow all operations on products" ON public.products;
DROP POLICY IF EXISTS "Allow all operations on product_operations" ON public.product_operations;
DROP POLICY IF EXISTS "Allow all operations on batches" ON public.batches;
DROP POLICY IF EXISTS "Allow all operations on batch_products" ON public.batch_products;
DROP POLICY IF EXISTS "Allow all operations on machines" ON public.machines;

-- Create secure RLS policies that require authentication
-- Products table - only authenticated users can access
CREATE POLICY "Authenticated users can view products" ON public.products
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert products" ON public.products
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update products" ON public.products
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete products" ON public.products
    FOR DELETE USING (auth.role() = 'authenticated');

-- Product operations table - only authenticated users can access
CREATE POLICY "Authenticated users can view product operations" ON public.product_operations
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert product operations" ON public.product_operations
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update product operations" ON public.product_operations
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete product operations" ON public.product_operations
    FOR DELETE USING (auth.role() = 'authenticated');

-- Batches table - only authenticated users can access
CREATE POLICY "Authenticated users can view batches" ON public.batches
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert batches" ON public.batches
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update batches" ON public.batches
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete batches" ON public.batches
    FOR DELETE USING (auth.role() = 'authenticated');

-- Batch products table - only authenticated users can access
CREATE POLICY "Authenticated users can view batch products" ON public.batch_products
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert batch products" ON public.batch_products
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update batch products" ON public.batch_products
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete batch products" ON public.batch_products
    FOR DELETE USING (auth.role() = 'authenticated');

-- Machines table - only authenticated users can access
CREATE POLICY "Authenticated users can view machines" ON public.machines
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert machines" ON public.machines
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update machines" ON public.machines
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete machines" ON public.machines
    FOR DELETE USING (auth.role() = 'authenticated');