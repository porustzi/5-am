import { useState } from 'react';
import ProductCatalog from '../components/ProductCatalog';

// Читаем модули из новой чистой папки live_products
const modules = import.meta.glob('../data/live_products/*.json', { eager: true }) as Record<string, any>;

// Мапим данные, кастуя их к any[], чтобы TS пропустил билд без придирок к структуре
const loadedProducts = Object.values(modules).map((mod: any) => {
  const data = mod.default ? mod.default : mod;
  
  // Возвращаем объект, страхуя базовые поля. 
  // Если твой ProductCatalog ждет поля 'name', 'brand', 'sizes' — подставим безопасные фолбеки.
  return {
    id: String(data.id || Math.random().toString()),
    name: String(data.name || data.title_ru || 'Без назви'),
    brand: String(data.brand || '5AM'),
    category: String(data.category || 'Одяг'),
    price: Number(data.price || 0),
    image: String(data.image || '/images/uploads
