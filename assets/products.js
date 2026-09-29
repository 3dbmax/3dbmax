// ==========================================
// MÓDULO FIREBASE & CATÁLOGO DINÁMICO B-MAX
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getFirestore, collection, getDocs, doc, setDoc, deleteDoc, writeBatch 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { 
    getStorage, ref, uploadBytes, getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBj5Sb7pvpHANbenQc9TStYFEWVxshlhcI",
    authDomain: "dbmax-fc3e4.firebaseapp.com",
    projectId: "dbmax-fc3e4",
    storageBucket: "dbmax-fc3e4.firebasestorage.app",
    messagingSenderId: "270673332593",
    appId: "1:270673332593:web:1e3993f47fff2973a0ced0",
    measurementId: "G-305Y8X0LXQ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Categorías base con imagen y descripción
const BASE_CATEGORIES = [
    { id: 'todos', name: 'Todos', image: '', subtitle: 'Ver todo el catálogo' },
    { id: 'organizacion', name: 'Organización', image: 'assets/imagenes/producto (1).jpg', subtitle: 'Funcionalidad en tu espacio' },
    { id: 'decoracion', name: 'Decoración', image: 'assets/imagenes/producto (2).jpg', subtitle: 'Detalles que hacen la diferencia' },
    { id: 'accesorios', name: 'Accesorios', image: 'assets/imagenes/producto (3).jpg', subtitle: 'Llevá tu estilo a otro nivel' },
    { id: 'juguetes', name: 'Juguetes y Figuras', image: 'assets/imagenes/producto (4).jpg', subtitle: 'Imaginación sin límites' },
    { id: 'personalizados', name: 'Personalizados', image: 'assets/imagenes/producto (5).jpg', subtitle: 'Tu idea, nuestro diseño' }
];

const BASE_PRODUCTS = [
    {
        id: 'org-01',
        name: 'Organizador Portalápices Modular',
        category: 'organizacion',
        categoryName: 'Organización',
        price: 9500,
        image: 'assets/imagenes/producto (1).jpg',
        shortDesc: 'Portalápices con compartimentos escalonados para escritorio.',
        desc: 'Diseñado para mantener tu espacio de trabajo impecable.',
        dimensions: '12 x 10 x 9 cm',
        material: 'PLA Premium ecológico',
        colors: ['Beige Nórdico', 'Negro Mate']
    }
];

export let BMAX_CATEGORIES = [];
export let BMAX_PRODUCTS = [];

export async function syncFirebaseData() {
    try {
        const catSnapshot = await getDocs(collection(db, "categorias"));
        if (catSnapshot.empty) {
            const batch = writeBatch(db);
            BASE_CATEGORIES.forEach(cat => batch.set(doc(db, "categorias", cat.id), cat));
            await batch.commit();
            BMAX_CATEGORIES = BASE_CATEGORIES;
        } else {
            BMAX_CATEGORIES = catSnapshot.docs.map(doc => doc.data());
        }

        const prodSnapshot = await getDocs(collection(db, "productos"));
        if (prodSnapshot.empty) {
            const batch = writeBatch(db);
            BASE_PRODUCTS.forEach(prod => batch.set(doc(db, "productos", prod.id), prod));
            await batch.commit();
            BMAX_PRODUCTS = BASE_PRODUCTS;
        } else {
            BMAX_PRODUCTS = prodSnapshot.docs.map(doc => doc.data());
        }
    } catch (e) {
        console.error("Error al sincronizar con Firebase:", e);
    }
}

export async function uploadImageToStorage(file, folder = 'productos') {
    const fileRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
}

export async function saveProductToFirebase(product) {
    await setDoc(doc(db, "productos", product.id), product);
    await syncFirebaseData();
}

export async function deleteProductFromFirebase(id) {
    await deleteDoc(doc(db, "productos", id));
    await syncFirebaseData();
}

export async function saveCategoryToFirebase(category) {
    await setDoc(doc(db, "categorias", category.id), category);
    await syncFirebaseData();
}

export async function deleteCategoryFromFirebase(id) {
    await deleteDoc(doc(db, "categorias", id));
    await syncFirebaseData();
}

export function formatPrice(amount) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0
    }).format(amount);
}
