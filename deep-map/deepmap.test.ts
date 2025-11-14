import { deepMap } from './deepmap.js';
import { map } from 'nanostores'

type obj1 = {
    a?: {
        b?: {
            c: string,
            d?: boolean,
            e?: number
        }
    }
    f?: string
    g?: number
    h?: boolean
}

type arr1 = Array<obj1>

const $storeObj1 = deepMap<obj1>({ f: 'initial' });
const $storeArr1 = deepMap<arr1>([{ h: true }]);
