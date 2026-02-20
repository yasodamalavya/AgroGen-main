'use client';

import React, { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/services/SupabaseClient';

const Provider = ({ children }: { children: React.ReactNode }) => {
    const { user } =useUser();

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        user && createNewUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const createNewUser = async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { data: Users, error } = await supabase
            .from('Users')
            .select('*')
            .eq('email', user?.primaryEmailAddress?.emailAddress);
            
        // console.log(Users);

        if(Users?.length == 0) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { data, error } = await supabase
                .from('Users')
                .insert([
                    {
                        name: user?.fullName,
                        email: user?.primaryEmailAddress?.emailAddress
                    },
                ])
                .select();
            // console.log(data, error);
        }
    }

    return (
        <div>
            {children}
        </div>
    )
}

export default Provider
