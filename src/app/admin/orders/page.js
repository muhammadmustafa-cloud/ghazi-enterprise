import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminOrders from '@/views/admin/AdminOrders';

export default function Page() {
  return (
    <ProtectedRoute>
      <AdminOrders />
    </ProtectedRoute>
  );
}
