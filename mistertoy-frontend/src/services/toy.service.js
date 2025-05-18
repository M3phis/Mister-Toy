import { storageService } from './storage.service'

const STORAGE_KEY = 'toys'

const labels = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle', 'Outdoor', 'Battery Powered']

const defaultToys = [
    {
        _id: 't101',
        name: 'Talking Doll',
        imgUrl: 'https://example.com/doll.jpg',
        price: 123,
        labels: ['Doll', 'Battery Powered', 'Baby'],
        createdAt: 1631031801011,
        inStock: true,
    }
]

export const toyService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getLabels: () => labels
}

async function query(filterBy = getDefaultFilter()) {
    let toys = storageService.loadFromStorage(STORAGE_KEY) || defaultToys
    if (!toys || !toys.length) {
        toys = defaultToys
        storageService.saveToStorage(STORAGE_KEY, toys)
    }

    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        toys = toys.filter(toy => regex.test(toy.name))
    }
    if (filterBy.inStock !== undefined) {
        toys = toys.filter(toy => toy.inStock === filterBy.inStock)
    }
    if (filterBy.labels && filterBy.labels.length > 0) {
        toys = toys.filter(toy =>
            filterBy.labels.every(label => toy.labels.includes(label))
        )
    }

    if (filterBy.sortBy) {
        toys.sort((a, b) => {
            switch (filterBy.sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name)
                case 'price':
                    return a.price - b.price
                case 'created':
                    return b.createdAt - a.createdAt
                default:
                    return 0
            }
        })
    }

    return toys
}

async function getById(toyId) {
    const toys = await query()
    const toy = toys.find(toy => toy._id === toyId)
    if (!toy) throw new Error(`Toy with id ${toyId} not found`)
    return toy
}

async function save(toyToSave) {
    // Validate required fields
    if (!toyToSave.name) throw new Error('Toy name is required')
    if (!toyToSave.price && toyToSave.price !== 0) throw new Error('Toy price is required')
    if (!Array.isArray(toyToSave.labels)) throw new Error('Toy labels must be an array')

    const toys = await query()

    if (toyToSave._id) {
        // Update existing toy
        const idx = toys.findIndex(toy => toy._id === toyToSave._id)
        if (idx === -1) throw new Error(`Toy with id ${toyToSave._id} not found`)
        toys[idx] = { ...toys[idx], ...toyToSave }
    } else {
        // Add new toy
        toyToSave = {
            ...toyToSave,
            _id: _makeId(),
            createdAt: Date.now(),
            inStock: toyToSave.inStock ?? true,
            imgUrl: toyToSave.imgUrl || 'https://example.com/toy.jpg'
        }
        toys.push(toyToSave)
    }

    storageService.saveToStorage(STORAGE_KEY, toys)
    return toyToSave
}

async function remove(toyId) {
    const toys = await query()
    const idx = toys.findIndex(toy => toy._id === toyId)
    if (idx === -1) throw new Error(`Toy with id ${toyId} not found`)
    toys.splice(idx, 1)
    storageService.saveToStorage(STORAGE_KEY, toys)
}

function getDefaultFilter() {
    return {
        txt: '',
        inStock: undefined,
        labels: [],
        sortBy: ''
    }
}

function _makeId(length = 5) {
    let txt = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
} 