import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AddProduct from '@/views/admin/AddProduct';

export default function Page() {
  return (
    <ProtectedRoute>
      <AddProduct />
    </ProtectedRoute>
  );
}
