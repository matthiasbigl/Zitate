import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://zsnhzbvopcaiwnmimqbk.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzbmh6YnZvcGNhaXdubWltcWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODEyODA0NjYsImV4cCI6MTk5Njg1NjQ2Nn0.3ngKuMc6dNnP3K1VJizV5TGQOrLaogXOxSb-2LwTKJg')