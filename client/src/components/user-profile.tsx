import { useAuth } from '@/components/auth/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { User, Mail, Calendar, Shield, Building, Settings, Edit, Save, X, Home } from 'lucide-react';
import { Link } from 'wouter';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Form validation schema
const editProfileSchema = z.object({
  firstName: z.string().min(1, "Ad tələb olunur"),
  lastName: z.string().min(1, "Soyad tələb olunur"),
  email: z.string().email("Düzgün email daxil edin"),
  companyName: z.string().min(1, "Şirkət adı tələb olunur"),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Mövcud şifrə tələb olunur"),
  newPassword: z.string().min(8, "Yeni şifrə ən azı 8 simvol olmalıdır"),
  confirmPassword: z.string().min(8, "Şifrə təsdiqi tələb olunur"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Şifrələr uyğun deyil",
  path: ["confirmPassword"],
});

export default function UserProfile() {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  if (!user) {
    return null;
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
  };

  const getRoleBadgeVariant = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'manager':
        return 'default';
      case 'hr':
        return 'secondary';
      case 'it':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'manager':
        return 'Manager';
      case 'hr':
        return 'HR Specialist';
      case 'it':
        return 'IT Support';
      default:
        return 'User';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-20 w-20">
            <AvatarImage 
              src={user.profileImageUrl || undefined} 
              alt={`${user.firstName} ${user.lastName}`}
            />
            <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <CardTitle className="text-2xl">
              {user.firstName} {user.lastName}
            </CardTitle>
            <CardDescription className="flex items-center justify-center gap-2 mt-2">
              <Mail className="h-4 w-4" />
              {user.email}
            </CardDescription>
          </div>

          {(user as any).role && (
            <Badge 
              variant={getRoleBadgeVariant((user as any).role)} 
              className="flex items-center gap-1"
              data-testid={`badge-role-${(user as any).role}`}
            >
              <Shield className="h-3 w-3" />
              {getRoleLabel((user as any).role)}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">İstifadəçi ID</p>
                <p className="text-sm text-muted-foreground" data-testid="text-user-id">
                  {user.id.slice(0, 8)}...
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Qeydiyyat tarixi</p>
                <p className="text-sm text-muted-foreground" data-testid="text-created-date">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('az-AZ') : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Hesab statusu</p>
                <p className="text-sm text-muted-foreground">
                  {user.isVerified ? (
                    <span className="text-green-600 font-medium">✓ Təsdiqlənmiş</span>
                  ) : (
                    <span className="text-orange-600 font-medium">⏳ Gözləyir</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Building className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Şirkət</p>
                <p className="text-sm text-muted-foreground">
                  Crocusoft MMC
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/">
              <Button 
                variant="default" 
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600" 
                data-testid="button-home"
              >
                <Home className="h-4 w-4 mr-2" />
                Ana səhifə
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={() => setIsEditMode(true)}
              data-testid="button-edit-profile"
            >
              <Edit className="h-4 w-4 mr-2" />
              Profili redaktə et
            </Button>
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={() => setShowPasswordForm(true)}
              data-testid="button-change-password"
            >
              <Shield className="h-4 w-4 mr-2" />
              Şifrəni dəyiş
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => {
                localStorage.removeItem('user');
                window.location.href = '/';
              }}
              data-testid="button-logout"
            >
              Çıxış
            </Button>
          </div>

          {/* Edit Profile Form */}
          {isEditMode && <EditProfileForm user={user} setUser={setUser} setIsEditMode={setIsEditMode} />}
          
          {/* Change Password Form */}
          {showPasswordForm && <ChangePasswordForm setShowPasswordForm={setShowPasswordForm} />}
        </div>
      </CardContent>
    </Card>
  );
}

// Edit Profile Form Component
function EditProfileForm({ user, setUser, setIsEditMode }: any) {
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      companyName: 'Crocusoft MMC',
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('/api/auth/profile', 'PATCH', data);
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast({
        title: "Profil yeniləndi",
        description: "Məlumatlarınız uğurla yeniləndi",
      });
      setIsEditMode(false);
    },
    onError: (error: any) => {
      toast({
        title: "Xəta",
        description: error.message || "Profil yeniləmə xətası",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    updateProfileMutation.mutate(data);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit className="h-5 w-5" />
          Profili redaktə et
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad</FormLabel>
                    <FormControl>
                      <Input placeholder="Adınızı daxil edin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soyad</FormLabel>
                    <FormControl>
                      <Input placeholder="Soyadınızı daxil edin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email ünvanınızı daxil edin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şirkət adı</FormLabel>
                    <FormControl>
                      <Input placeholder="Şirkət adını daxil edin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={updateProfileMutation.isPending}
                data-testid="button-save-profile"
              >
                <Save className="h-4 w-4 mr-2" />
                {updateProfileMutation.isPending ? "Yadda saxlanılır..." : "Yadda saxla"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditMode(false)}
                data-testid="button-cancel-edit"
              >
                <X className="h-4 w-4 mr-2" />
                İmtina
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// Change Password Form Component
function ChangePasswordForm({ setShowPasswordForm }: any) {
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Şifrə dəyişdirmə xətası');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Şifrə dəyişdirildi",
        description: "Şifrəniz uğurla dəyişdirildi. Email bildirişi göndərildi.",
      });
      setShowPasswordForm(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Xəta",
        description: error.message || "Şifrə dəyişdirmə xətası",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    changePasswordMutation.mutate(data);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Şifrəni dəyiş
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mövcud şifrə</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Mövcud şifrənizi daxil edin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yeni şifrə</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Yeni şifrənizi daxil edin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Şifrəni təsdiq et</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Yeni şifrənizi təkrar daxil edin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={changePasswordMutation.isPending}
                data-testid="button-save-password"
              >
                <Save className="h-4 w-4 mr-2" />
                {changePasswordMutation.isPending ? "Yadda saxlanılır..." : "Şifrəni dəyiş"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowPasswordForm(false)}
                data-testid="button-cancel-password"
              >
                <X className="h-4 w-4 mr-2" />
                İmtina
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}