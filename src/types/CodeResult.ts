/**
 * @meaning results from run of the code
 */
export type CodeResult = {
    status: 'success' | 'error'
    message: string
    time: number
}
