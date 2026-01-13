import ProductClient from './ProductClient';

export const dynamic = 'force-dynamic';

export default function ProductPage({ params }) {
    const { id } = params;
    return <ProductClient id={id} />;
}
