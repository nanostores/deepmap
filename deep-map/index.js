import { atom } from 'nanostores'
import { getAllKeysFromPath, getPath, setPath, setByKey } from './path.js'

export { getPath, setByKey, setPath } from './path.js'

/* @__NO_SIDE_EFFECTS__ */
export const deepMap = (initial = {}) => {
  let $deepMap = atom(initial)
  $deepMap.setKey = (key, value) => {
    if (getPath($deepMap.value, key) !== value) {
      let oldValue = $deepMap.value
      $deepMap.value = setPath($deepMap.value, key, value)
      $deepMap.notify(oldValue, key)
    }
  }
  return $deepMap
}

export function getKey(store, key) {
  let value = store.get()
  return getPath(value, key)
}

export function updateKey(store, key, value) {
  // 1. Obtiene el valor actual en esa ruta
  let oldValue = getPath(store.get(), key);

  // 2. Comprueba el TIPO del valor existente
  if (Array.isArray(oldValue)) {
    // Si es un array, reemplaza su contenido
    oldValue.splice(0, oldValue.length, ...value);
    store.setKey(key, oldValue); // Notifica el cambio
    return;
  }

  // 3. Si es un objeto (o cualquier otra cosa), lo fusiona
  let newValue = { ...oldValue, ...value };
  store.setKey(key, newValue); // Notifica el cambio
}