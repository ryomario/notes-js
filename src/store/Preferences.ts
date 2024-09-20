import { useEffect, useState } from "react";
import DB from "./DB";

const TABLE = 'preferences'

export default class Preferences {
    static get(name: string, callback: (data: any)=>void) {
        DB.table(TABLE).get<any>(name).then(callback)
    }
    static set(name: string, value: any, callback: ()=>void) {
        DB.table(TABLE).set(name,value).then(callback)
    }
}
export function useSavedState<T>(name: string, defaultValue: T) {
    const [state, setState] = useState<T>()
    useEffect(() => {
        Preferences.get('save-last-state',(isSave: boolean) => {
            if(isSave){
                Preferences.get(name,(loadedState: T) => {
                    if(loadedState != undefined)setState(loadedState)
                })
            }else setState(defaultValue)
        })
    },[])
    useEffect(() => {
        Preferences.get('save-last-state',(isSave: boolean) => {
            if(isSave && state != undefined){
                Preferences.set(name,state,() => {
                    // console.log('saved state',name)
                })
            }
        })
    },[state])
    return {state, setState}
}