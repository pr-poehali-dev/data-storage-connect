import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { authAPI, type User } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      if (!authAPI.isAuthenticated()) {
        navigate('/');
        return;
      }

      try {
        const profile = await authAPI.getProfile();
        setUser(profile);
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить профиль',
          variant: 'destructive',
        });
        authAPI.logout();
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate, toast]);

  const handleLogout = () => {
    authAPI.logout();
    toast({
      title: 'Выход выполнен',
      description: 'До скорой встречи!',
    });
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Icon name="Loader2" className="animate-spin text-primary mx-auto" size={48} />
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <Icon name="Database" className="text-primary" size={28} />
            <span className="text-xl font-bold">CloudStore</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Привет, {user.name}</span>
            <Button onClick={handleLogout} variant="outline">Выйти</Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Личный кабинет</h1>
            <p className="text-muted-foreground">Управляйте своими данными и API ключами</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Icon name="User" className="text-primary" size={32} />
                <Badge variant="secondary">Активен</Badge>
              </div>
              <h3 className="font-semibold text-lg mb-1">Профиль</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Icon name="Key" className="text-primary" size={32} />
                <Badge>1</Badge>
              </div>
              <h3 className="font-semibold text-lg mb-1">API Ключи</h3>
              <p className="text-sm text-muted-foreground">Управление ключами</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Icon name="Database" className="text-primary" size={32} />
                <Badge>0</Badge>
              </div>
              <h3 className="font-semibold text-lg mb-1">Хранилище</h3>
              <p className="text-sm text-muted-foreground">0 записей</p>
            </Card>
          </div>

          <Card className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="User" className="text-primary" size={40} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
                <p className="text-muted-foreground mb-4">{user.email}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Calendar" size={16} />
                  <span>Регистрация: {new Date(user.created_at).toLocaleDateString('ru-RU')}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6 space-y-4">
              <h3 className="font-semibold text-lg mb-4">Ваш API токен</h3>
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm break-all">
                {authAPI.getToken()}
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Icon name="Info" size={16} />
                Используйте этот токен в заголовке X-Auth-Token для API запросов
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-4">
              <Icon name="BookOpen" className="text-primary mt-1" size={24} />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Начните использовать API</h3>
                <p className="text-muted-foreground mb-4">
                  Используйте наш REST API для хранения и управления данными из ваших приложений
                </p>
                <Button onClick={() => navigate('/')}>
                  <Icon name="Code" size={18} className="mr-2" />
                  Посмотреть документацию
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
