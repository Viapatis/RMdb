import {
    InfoWrap,
} from '../../lib/apiCall'

export interface BaseState<T> extends Pick<InfoWrap<void>, 'info'> {
    requestInfo: {
        status: string,
        err: string,
        curId: string
    }
    data: T[]
}