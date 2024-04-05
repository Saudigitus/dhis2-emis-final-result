import React from 'react'
import {useSearchParams} from 'react-router-dom'

const useQueryParams = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const add = (key: string, value: string) => {
        searchParams.set(key, value)
        setSearchParams(searchParams)
    }
    const remove = (key: string) => {
        searchParams.delete(key)
        setSearchParams(searchParams)
    }
    const useQuery = () => {
        return React.useMemo(() => new URLSearchParams(searchParams), [searchParams])
    }

    const urlParamiters = () => {
        return {
            school: useQuery().get('school'),
            schoolName: useQuery().get('schoolName'),
            grade: useQuery().get('grade'),
            class: useQuery().get('class'),
            academicYear: useQuery().get('academicYear'),
            sectionType: useQuery().get('sectionType')
        }
    }
    return {
        add,
        remove,
        useQuery,
        urlParamiters
    }
}
export {useQueryParams}
