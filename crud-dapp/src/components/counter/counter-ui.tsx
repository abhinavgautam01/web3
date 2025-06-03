'use client'

import { PublicKey } from '@solana/web3.js'
import { useCounterProgram, useCounterProgramAccount } from './counter-data-access'
import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'

export function CounterCreate() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const { createEntry } = useCounterProgram()
  const { publicKey } = useWallet()

  const isFormValid = title.trim() !== '' && message.trim() !== ''

  const handleSubmit = () => {
    if (publicKey && isFormValid) {
      createEntry.mutateAsync({ title, message, owner: publicKey })
    }
    if (!publicKey) {
      return <p>Connect Your Wallet.</p>
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 rounded-2xl shadow-lg space-y-4">
    <h2 className="text-xl font-semibold text-gray-700">Create a Journal</h2>
  
    <input
      type="text"
      placeholder="Enter a title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className="input input-bordered w-full"
    />
  
    <textarea
      placeholder="Write your message..."
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      className="textarea textarea-bordered w-full min-h-[100px]"
    />
  
    <button
      onClick={handleSubmit}
      disabled={createEntry.isPending || !isFormValid}
      className="btn btn-primary w-full disabled:opacity-50 bg-neutral-400"
    >
      {createEntry.isPending ? "Submitting..." : "Submit"}
    </button>
  </div>
  
  )
}

export function CounterList() {
  const { accounts, getProgramAccount } = useCounterProgram()

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
      </div>
    )
  }
  return (
    <div className={'space-y-6'}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {accounts.data?.map((account) => (
            <CounterCard key={account.publicKey.toString()} account={account.publicKey} />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={'text-2xl'}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  )
}

function CounterCard({ account }: { account: PublicKey }) {
  const { accountQuery, updateEntry, deleteEntry } = useCounterProgramAccount({
    account,
  })

  const { publicKey } = useWallet()

  const [message, setMessage] = useState('')
  const title = accountQuery.data?.title

  const isFormValid = message.trim() !== ''

  const handleSubmit = () => {
    if (publicKey && isFormValid && title) {
      updateEntry.mutateAsync({ title, message , owner: publicKey})
    }
    if (!publicKey) {
      return <p>Connect Your Wallet.</p>
    }
  }

  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="card card-bordered border-base-300 border-4 text-neutral-content">
      <div className="card-body items-center text-center">
        <div className="space-y-6">
          <h2 className="card-title justify-center text-3xl cursor-pointer" onClick={() => accountQuery.refetch()}>
            {accountQuery.data?.title}
          </h2>
          <p>{accountQuery.data?.message}</p>
          <div className="card-actions justify-around">
            <textarea
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="textarea textarea-bordered w-full max-w-xs"
            />

            <button
              onClick={handleSubmit}
              disabled={updateEntry.isPending || !isFormValid}
              className="btn btn-primary w-full disabled:opacity-50 bg-neutral-400"
            >
              Update Journal Entry
            </button>
            <button
              onClick={() => {
                const title = accountQuery.data?.title
                if (title) {
                  return deleteEntry.mutateAsync(title)
                }
              }}
              className="btn btn-primary w-full disabled:opacity-50 bg-neutral-400"
            >
              Delete Journal Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
