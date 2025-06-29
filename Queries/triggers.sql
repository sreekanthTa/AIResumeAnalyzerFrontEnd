-- Create a function that updates updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger on the customers table
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();