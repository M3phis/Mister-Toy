import { createSelector } from '@reduxjs/toolkit'

// Base selectors
const selectToyModule = state => state.toyModule
const selectToys = state => state.toyModule.toys
const selectIsLoading = state => state.toyModule.isLoading
const selectError = state => state.toyModule.error
const selectFilterBy = state => state.toyModule.filterBy

// Memoized combined selector for toy state
export const selectToyState = createSelector(
    [selectToys, selectIsLoading, selectError],
    (toys, isLoading, error) => ({
        toys,
        isLoading,
        error
    })
)

// Memoized selector for filter state
export const selectFilterState = createSelector(
    [selectFilterBy],
    (filterBy) => filterBy
) 