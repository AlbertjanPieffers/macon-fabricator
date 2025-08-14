import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Package } from 'lucide-react';

interface Product {
  _id?: string;
  index?: number;
  Name?: string;
  FileName?: string;
  Profile?: string;
  Length?: number;
  FullPath?: string;
  Data8?: string; // Profile fallback
}

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [profileFilter, setProfileFilter] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { apiClient } = await import('@/lib/api');
        const products = await apiClient.getProducts();
        
        // Transform MongoDB products to frontend format
        const transformedProducts = products.map((product: any) => ({
          _id: product._id || product.index?.toString(),
          Name: product.Name || product.FileName || 'Unnamed',
          Profile: product.Profile || product.Data8 || 'Unknown',
          Length: product.Length || (product.Data4 ? parseInt(product.Data4) : 0),
          FileName: product.FileName || 'N/A'
        }));
        
        setProducts(transformedProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const name = product.Name || product.FileName || '';
    const profile = product.Profile || product.Data8 || '';
    
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProfile = !profileFilter || profile === profileFilter;
    
    return matchesSearch && matchesProfile;
  });

  const uniqueProfiles = Array.from(new Set(
    products.map(p => p.Profile || p.Data8).filter(Boolean)
  ));

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-card rounded w-1/4 mb-6"></div>
          <div className="h-96 bg-card rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Products</h1>
        <p className="text-muted-foreground">Manage and view product definitions</p>
      </div>

      <Card className="bg-card border-border rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Package className="h-5 w-5 text-primary" />
            Product Library
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>
            <Select value={profileFilter} onValueChange={setProfileFilter}>
              <SelectTrigger className="w-48 bg-background border-border">
                <SelectValue placeholder="Filter by profile" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Profiles</SelectItem>
                {uniqueProfiles.map(profile => (
                  <SelectItem key={profile} value={profile}>{profile}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Products Table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/10 border-border hover:bg-muted/10">
                  <TableHead className="text-muted-foreground">Name</TableHead>
                  <TableHead className="text-muted-foreground">Profile</TableHead>
                  <TableHead className="text-muted-foreground">Length (mm)</TableHead>
                  <TableHead className="text-muted-foreground">File</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product._id} className="border-border hover:bg-muted/5">
                    <TableCell className="font-medium text-card-foreground">
                      {product.Name || product.FileName || 'Unnamed'}
                    </TableCell>
                    <TableCell className="text-card-foreground">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-secondary/20 text-secondary-foreground">
                        {product.Profile || product.Data8 || 'Unknown'}
                      </span>
                    </TableCell>
                    <TableCell className="text-card-foreground">
                      {product.Length ? `${product.Length.toLocaleString()}` : 'N/A'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {product.FileName || 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No products found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};