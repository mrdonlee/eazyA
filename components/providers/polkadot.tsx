'use client'
import React from 'react'
import { UseMutateFunction, useMutation } from '@tanstack/react-query'
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp'
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import { uploadDataset } from '@/actions/upload-dataset'

type PolkadotContextType = {
    account: InjectedAccountWithMeta | null
    uploadDatasetMutation: UseMutateFunction<string, Error>
    isUploadPending: boolean
    isUploadError: boolean
}

type PolkadotProviderProps = React.PropsWithChildren

const PolkadotContext = React.createContext<PolkadotContextType | null>(null)

export default function PolkadotProvider({ children }: PolkadotProviderProps) {
    const [account, setAccount] = React.useState<InjectedAccountWithMeta | null>(null)

    const {
        mutate: uploadDatasetMutation,
        isPending: isUploadPending,
        isError: isUploadError,
    } = useMutation({
        mutationFn: () => uploadDataset(new File([], '')),
        onSuccess: data => {
            console.log('Upload successful:', data)
        },
        onError: error => {
            console.error('Upload failed:', error)
        },
    })
    React.useEffect(() => {
        async function connectPolkadotWallet() {
            try {
                const extensions = await web3Enable(process.env.NEXT_PUBLIC_APP_NAME!)

                if (extensions.length === 0) {
                    console.error('No extension found. Please install the Polkadot.js extension')
                    return null
                }

                const allAccounts = await web3Accounts()

                if (allAccounts.length === 0) {
                    console.error('No accounts found. Please create an account in the Polkadot.js extension')
                    return null
                }

                console.log('Default account:', allAccounts[0])
                setAccount(allAccounts[0])
            } catch (error) {
                console.error('Error connecting to Polkadot wallet:', error)
                return null
            }
        }

        connectPolkadotWallet()
    }, [])

    return (
        <PolkadotContext.Provider
            value={{
                account,
                uploadDatasetMutation,
                isUploadPending,
                isUploadError,
            }}
        >
            {children}
        </PolkadotContext.Provider>
    )
}

export function usePolkadot() {
    const context = React.useContext(PolkadotContext)
    if (!context) {
        throw new Error('usePolkadot must be used within a PolkadotProvider')
    }
    return context
}
