import { v4 } from 'uuid'

export const getUUID = (fullID: boolean = true) => {
    return fullID ? v4() : v4().slice(0, 8)
}
