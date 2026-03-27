import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useBooks, useCreateBook, useUpdateBook, useDeleteBook } from "@/hooks/useBooks";
import { type Book } from "@/lib/books";
import { useAllOrders, useUpdateOrderStatus } from "@/hooks/useOrders";
import { useCategories, useDeleteCategory } from "@/hooks/useCategories";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateBookSchema, type CreateBookDto } from "@/lib/api";
import { OrderStatus } from "@/lib/api";
import { BookOpen, Package, Users, DollarSign, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import StickyHeader from "@/components/StickyHeader";
import Footer from "@/components/Footer";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { data: books } = useBooks({ page: 1, limit: 10 });
  const { data: orders } = useAllOrders({ page: 1, limit: 10 });
  const { data: categories } = useCategories();
  const { mutate: createBook } = useCreateBook();
  const { mutate: updateBook } = useUpdateBook();
  const { mutate: deleteBook } = useDeleteBook();
  const { mutate: updateOrderStatus } = useUpdateOrderStatus();
  const { mutate: deleteCategory } = useDeleteCategory();

  const [showAddBook, setShowAddBook] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBookDto>({
    resolver: zodResolver(CreateBookSchema),
  });

  const handleSubmitBook = (data: CreateBookDto) => {
    if (editingBook) {
      updateBook({ id: editingBook.id, bookData: data }, {
        onSuccess: () => {
          reset();
          setShowAddBook(false);
          setEditingBook(null);
        },
      });
    } else {
      createBook(data, {
        onSuccess: () => {
          reset();
          setShowAddBook(false);
        },
      });
    }
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    reset({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      description: book.description ?? undefined,
      price: book.price,
      stockQuantity: book.stockQuantity,
      categoryId: book.categoryId ?? undefined,
      imageUrl: book.imageUrl ?? undefined,
      publishedYear: book.publishedYear ?? undefined,
      publisher: book.publisher ?? undefined,
    });
    setShowAddBook(true);
  };

  const handleCloseModal = () => {
    setShowAddBook(false);
    setEditingBook(null);
    reset();
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteCategory(categoryId);
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatus({ orderId, status });
  };

  const handleDeleteBook = (bookId: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      deleteBook(bookId);
    }
  };

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <StickyHeader />
        <div className="flex-1 section-padding">
          <div className="max-w-4xl mx-auto text-center py-16">
            <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-6">You don't have permission to access this page.</p>
            <Button asChild>
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StickyHeader />
      <div className="flex-1 section-padding">
        <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={() => setShowAddBook(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Book
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Books</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{books?.pagination?.total || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders?.pagination?.total || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories?.length || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${orders?.orders?.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2) || "0.00"}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="books" className="space-y-4">
          <TabsList>
            <TabsTrigger value="books">Books</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="books" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Books</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {books?.books?.map((book) => (
                    <div key={book.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">{book.author}</p>
                        <p className="text-sm">${book.price.toFixed(2)} - Stock: {book.stockQuantity}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditBook(book)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteBook(book.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders?.orders?.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">Order #{order.id.slice(-8)}</h3>
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} items - ${order.totalAmount.toFixed(2)}
                        </p>
                        <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge>{order.status}</Badge>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="px-2 py-1 border rounded text-sm"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories?.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.slug}</p>
                        {category.description && (
                          <p className="text-sm">{category.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Book Modal */}
        {showAddBook && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(handleSubmitBook)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label>Title</label>
                      <input {...register("title")} className="w-full p-2 border rounded" />
                      {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label>Author</label>
                      <input {...register("author")} className="w-full p-2 border rounded" />
                      {errors.author && <p className="text-sm text-destructive">{errors.author.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label>Price</label>
                      <input type="number" step="0.01" {...register("price", { valueAsNumber: true })} className="w-full p-2 border rounded" />
                      {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label>Stock Quantity</label>
                      <input type="number" {...register("stockQuantity", { valueAsNumber: true })} className="w-full p-2 border rounded" />
                      {errors.stockQuantity && <p className="text-sm text-destructive">{errors.stockQuantity.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label>ISBN</label>
                      <input {...register("isbn")} className="w-full p-2 border rounded" />
                    </div>
                    <div className="space-y-2">
                      <label>Published Year</label>
                      <input type="number" {...register("publishedYear", { valueAsNumber: true })} className="w-full p-2 border rounded" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label>Publisher</label>
                    <input {...register("publisher")} className="w-full p-2 border rounded" />
                  </div>

                  <div className="space-y-2">
                    <label>Description</label>
                    <textarea {...register("description")} rows={4} className="w-full p-2 border rounded" />
                  </div>

                  <div className="space-y-2">
                    <label>Image URL</label>
                    <input {...register("imageUrl")} className="w-full p-2 border rounded" />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">{editingBook ? 'Save Changes' : 'Add Book'}</Button>
                    <Button type="button" variant="outline" onClick={handleCloseModal}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
