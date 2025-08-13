-- Create manufacturing database schema for MACON Dash

-- Product profiles enum
CREATE TYPE public.product_profile AS ENUM ('IPE240', 'IPE300', 'HEB200', 'HEB300', 'L80x80', 'L100x100');

-- Product status enum  
CREATE TYPE public.product_status AS ENUM ('Draft', 'Ready', 'Processing', 'Complete');

-- Batch status enum
CREATE TYPE public.batch_status AS ENUM ('Draft', 'Queued', 'Running', 'Paused', 'Completed', 'Error');

-- Priority enum
CREATE TYPE public.priority_level AS ENUM ('Low', 'Medium', 'High', 'Critical');

-- Create products table
CREATE TABLE public.products (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    profile product_profile NOT NULL,
    length_mm INTEGER NOT NULL,
    status product_status NOT NULL DEFAULT 'Draft',
    priority INTEGER DEFAULT 1,
    data3 TEXT,
    data5 TEXT,
    data6 TEXT,
    estimated_cut_time_seconds INTEGER,
    operations_count INTEGER DEFAULT 0,
    nc_file_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create product operations table
CREATE TABLE public.product_operations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    operation_type TEXT NOT NULL,
    position_mm INTEGER NOT NULL,
    size_value NUMERIC,
    angle_value NUMERIC,
    operation_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create batches table
CREATE TABLE public.batches (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    batch_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    status batch_status NOT NULL DEFAULT 'Draft',
    priority priority_level NOT NULL DEFAULT 'Medium',
    operator_name TEXT NOT NULL,
    start_time TIME,
    estimated_completion_time TIME,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    total_parts INTEGER DEFAULT 0,
    completed_parts INTEGER DEFAULT 0,
    efficiency_percentage NUMERIC(5,2) DEFAULT 0,
    quality_score_percentage NUMERIC(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create batch products junction table
CREATE TABLE public.batch_products (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    batch_id UUID REFERENCES public.batches(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    completed_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create machine status table for overview
CREATE TABLE public.machines (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    machine_name TEXT NOT NULL,
    machine_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Idle',
    current_batch_id UUID REFERENCES public.batches(id),
    efficiency_percentage NUMERIC(5,2) DEFAULT 0,
    uptime_hours NUMERIC(8,2) DEFAULT 0,
    last_maintenance DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batch_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.machines ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is an internal manufacturing system)
CREATE POLICY "Allow all operations on products" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow all operations on product_operations" ON public.product_operations FOR ALL USING (true);
CREATE POLICY "Allow all operations on batches" ON public.batches FOR ALL USING (true);
CREATE POLICY "Allow all operations on batch_products" ON public.batch_products FOR ALL USING (true);
CREATE POLICY "Allow all operations on machines" ON public.machines FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_products_product_id ON public.products(product_id);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_batches_batch_id ON public.batches(batch_id);
CREATE INDEX idx_batches_status ON public.batches(status);
CREATE INDEX idx_batch_products_batch_id ON public.batch_products(batch_id);
CREATE INDEX idx_machines_status ON public.machines(status);

-- Create update trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_batches_updated_at
    BEFORE UPDATE ON public.batches
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_machines_updated_at
    BEFORE UPDATE ON public.machines
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for testing
INSERT INTO public.products (product_id, name, profile, length_mm, status, priority) VALUES
('P001', 'New Product', 'IPE240', 6000, 'Draft', 1),
('P002', 'Beam Section A', 'IPE300', 4500, 'Ready', 2),
('P003', 'Column Base', 'HEB200', 3000, 'Processing', 3);

INSERT INTO public.batches (batch_id, name, status, priority, operator_name, start_time, estimated_completion_time, progress_percentage, total_parts, completed_parts, efficiency_percentage, quality_score_percentage) VALUES
('B001', 'Morning Production', 'Running', 'High', 'John Smith', '06:00', '14:30', 65, 23, 15, 94.2, 98.5),
('B002', 'Afternoon Batch', 'Queued', 'Medium', 'Maria Garcia', '14:30', '22:00', 0, 32, 0, 0, 0),
('B003', 'Special Order', 'Completed', 'High', 'Mike Johnson', '08:00', '12:00', 100, 5, 5, 97.8, 99.2);

INSERT INTO public.machines (machine_name, machine_type, status, efficiency_percentage, uptime_hours, last_maintenance) VALUES
('CNC Mill #1', 'Milling', 'Running', 94.2, 142.5, '2024-01-10'),
('Plasma Cutter #1', 'Cutting', 'Running', 87.8, 156.2, '2024-01-08'),
('Drill Press #2', 'Drilling', 'Idle', 0, 0, '2024-01-12');