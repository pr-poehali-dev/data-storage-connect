import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { authAPI, type User } from '@/lib/auth';
import { dataAPI, type DataRecord } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataRecords, setDataRecords] = useState<DataRecord[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DataRecord | null>(null);
  
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [editValue, setEditValue] = useState('');
  
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
        await loadData();
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

  const loadData = async () => {
    setLoadingData(true);
    try {
      const data = await dataAPI.getAll();
      setDataRecords(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные',
        variant: 'destructive',
      });
    } finally {
      setLoadingData(false);
    }
  };

  const handleCreate = async () => {
    if (!newKey || !newValue) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    try {
      await dataAPI.create(newKey, newValue);
      toast({
        title: 'Успешно!',
        description: 'Запись создана',
      });
      setNewKey('');
      setNewValue('');
      setIsCreateOpen(false);
      await loadData();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось создать запись',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = async () => {
    if (!editingRecord || !editValue) {
      toast({
        title: 'Ошибка',
        description: 'Заполните значение',
        variant: 'destructive',
      });
      return;
    }

    try {
      await dataAPI.update(editingRecord.id, editValue);
      toast({
        title: 'Успешно!',
        description: 'Запись обновлена',
      });
      setIsEditOpen(false);
      setEditingRecord(null);
      setEditValue('');
      await loadData();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось обновить запись',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await dataAPI.delete(id);
      toast({
        title: 'Успешно!',
        description: 'Запись удалена',
      });
      await loadData();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось удалить запись',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    toast({
      title: 'Выход выполнен',
      description: 'До скорой встречи!',
    });
    navigate('/');
  };

  const openEdit = (record: DataRecord) => {
    setEditingRecord(record);
    setEditValue(record.value);
    setIsEditOpen(true);
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Личный кабинет</h1>
              <p className="text-muted-foreground">Управляйте своими данными и API ключами</p>
            </div>
            
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Icon name="Plus" size={18} className="mr-2" />
                  Создать запись
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Создать новую запись</DialogTitle>
                  <DialogDescription>
                    Добавьте ключ и значение для хранения данных
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="key">Ключ</Label>
                    <Input
                      id="key"
                      placeholder="my_key"
                      value={newKey}
                      onChange={(e) => setNewKey(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="value">Значение</Label>
                    <Input
                      id="value"
                      placeholder="my_value"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleCreate} className="w-full">
                    Создать
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
              <h3 className="font-semibold text-lg mb-1">API Ключ</h3>
              <p className="text-sm text-muted-foreground">JWT токен активен</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Icon name="Database" className="text-primary" size={32} />
                <Badge>{dataRecords.length}</Badge>
              </div>
              <h3 className="font-semibold text-lg mb-1">Хранилище</h3>
              <p className="text-sm text-muted-foreground">{dataRecords.length} записей</p>
            </Card>
          </div>

          <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Ваши данные</h2>
              <Button variant="outline" onClick={loadData} disabled={loadingData}>
                <Icon name={loadingData ? "Loader2" : "RefreshCw"} size={18} className={`mr-2 ${loadingData ? 'animate-spin' : ''}`} />
                Обновить
              </Button>
            </div>

            {loadingData ? (
              <div className="text-center py-12">
                <Icon name="Loader2" className="animate-spin text-primary mx-auto mb-4" size={48} />
                <p className="text-muted-foreground">Загрузка данных...</p>
              </div>
            ) : dataRecords.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="Database" className="text-muted-foreground mx-auto mb-4" size={64} />
                <h3 className="text-lg font-semibold mb-2">Нет данных</h3>
                <p className="text-muted-foreground mb-6">Создайте первую запись для начала работы</p>
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Icon name="Plus" size={18} className="mr-2" />
                  Создать запись
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {dataRecords.map((record) => (
                  <Card key={record.id} className="p-4 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{record.key}</Badge>
                          <span className="text-xs text-muted-foreground">
                            ID: {record.id}
                          </span>
                        </div>
                        <p className="text-lg font-mono mb-2">{record.value}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Icon name="Calendar" size={12} />
                            {new Date(record.created_at).toLocaleDateString('ru-RU')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="Clock" size={12} />
                            {new Date(record.updated_at).toLocaleTimeString('ru-RU')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => openEdit(record)}>
                          <Icon name="Pencil" size={16} />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(record.id)}>
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-8 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-4">
              <Icon name="BookOpen" className="text-primary mt-1" size={24} />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">API Токен</h3>
                <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm break-all mb-4">
                  {authAPI.getToken()}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Используйте этот токен в заголовке X-Auth-Token для API запросов
                </p>
                <Button onClick={() => navigate('/')}>
                  <Icon name="Code" size={18} className="mr-2" />
                  Посмотреть документацию API
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать запись</DialogTitle>
            <DialogDescription>
              Изменить значение для ключа: {editingRecord?.key}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-value">Значение</Label>
              <Input
                id="edit-value"
                placeholder="новое значение"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            </div>
            <Button onClick={handleEdit} className="w-full">
              Сохранить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
