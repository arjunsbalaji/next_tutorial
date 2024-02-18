'use client'

import React from 'react'
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"

import { Zen_Dots } from 'next/font/google'
import { Form } from '@/components/ui/form';

const formSchema = z.object({
  userID: z.string(),
  //strengths: ,
})

const handleSubmit = () => {

}


export default function AccountPage() {
  /*
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userID: "",

    }
  })
  */
  return (
    <div>
    </div>
  )
}
