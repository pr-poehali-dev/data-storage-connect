import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { authAPI, type User } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const result = await authAPI.login(loginEmail, loginPassword);
      setUser(result.user);
      toast({
        title: 'Успешно!',
        description: `Добро пожаловать, ${result.user.name}!`,
      });
      setLoginEmail('');
      setLoginPassword('');
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Ошибка входа',
        description: error instanceof Error ? error.message : 'Неверные данные',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!registerName || !registerEmail || !registerPassword) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const result = await authAPI.register(registerName, registerEmail, registerPassword);
      setUser(result.user);
      toast({
        title: 'Регистрация успешна!',
        description: `Добро пожаловать, ${result.user.name}!`,
      });
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Ошибка регистрации',
        description: error instanceof Error ? error.message : 'Не удалось зарегистрироваться',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
    toast({
      title: 'Выход выполнен',
      description: 'До скорой встречи!',
    });
  };

  const scrollToAuth = () => {
    const authSection = document.getElementById('auth-section');
    authSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveSection('home')}>
            <Icon name="Database" className="text-primary" size={28} />
            <span className="text-xl font-bold">CloudStore API</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => setActiveSection('home')}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                activeSection === 'home' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Главная
            </button>
            <button
              onClick={() => setActiveSection('features')}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                activeSection === 'features' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Возможности
            </button>
            <button
              onClick={() => setActiveSection('api')}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                activeSection === 'api' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              API
            </button>
            <button
              onClick={() => setActiveSection('pricing')}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                activeSection === 'pricing' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Тарифы
            </button>
          </div>

          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Привет, {user.name}</span>
              <Button onClick={() => navigate('/dashboard')} variant="default">Кабинет</Button>
            </div>
          ) : (
            <Button className="hidden md:flex" onClick={scrollToAuth}>Начать бесплатно</Button>
          )}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Icon name="Menu" size={20} />
          </Button>
        </div>
      </nav>

      {activeSection === 'home' && (
        <>
          <section className="py-20 md:py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <div className="container mx-auto px-4 relative">
              <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
                <Badge variant="secondary" className="mb-4">
                  <Icon name="Zap" size={14} className="mr-1" />
                  Многопользовательская платформа
                </Badge>
                
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                  API для хранения
                  <span className="block text-primary mt-2">данных ваших пользователей</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                  Зарегистрируйтесь за 30 секунд. Получите JWT токен. Храните данные через REST API. Всё просто.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button size="lg" className="text-base" onClick={scrollToAuth}>
                    <Icon name="Rocket" size={18} className="mr-2" />
                    Начать бесплатно
                  </Button>
                  <Button size="lg" variant="outline" className="text-base" onClick={() => setActiveSection('api')}>
                    <Icon name="Code" size={18} className="mr-2" />
                    Документация API
                  </Button>
                </div>

                <div className="pt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Icon name="CheckCircle2" className="text-primary" size={16} />
                    <span>JWT авторизация</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="CheckCircle2" className="text-primary" size={16} />
                    <span>REST API</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="CheckCircle2" className="text-primary" size={16} />
                    <span>Бесплатный план</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Как это работает</h2>
                <p className="text-lg text-muted-foreground">Три простых шага до запуска</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <Card className="p-8 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary font-bold text-xl">
                    1
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Регистрация</h3>
                  <p className="text-muted-foreground">
                    Создайте аккаунт за 30 секунд. Подтверждение email не требуется.
                  </p>
                </Card>

                <Card className="p-8 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary font-bold text-xl">
                    2
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Получите токен</h3>
                  <p className="text-muted-foreground">
                    JWT токен генерируется автоматически. Используйте его для API запросов.
                  </p>
                </Card>

                <Card className="p-8 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary font-bold text-xl">
                    3
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Храните данные</h3>
                  <p className="text-muted-foreground">
                    Создавайте, читайте, обновляйте и удаляйте записи через простой REST API.
                  </p>
                </Card>
              </div>
            </div>
          </section>

          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Пример использования</h2>
                  <p className="text-lg text-muted-foreground">Простой API для ваших проектов</p>
                </div>

                <Card className="p-8 bg-muted/30">
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary">JavaScript</Badge>
                        <span className="text-sm text-muted-foreground">Создание записи</span>
                      </div>
                      <div className="bg-card border rounded-lg p-4 font-mono text-sm overflow-x-auto">
<pre className="text-foreground">{`// Создать запись
const response = await fetch('https://api.cloudstore.dev/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Auth-Token': 'YOUR_JWT_TOKEN'
  },
  body: JSON.stringify({
    key: 'user_settings',
    value: JSON.stringify({ theme: 'dark', lang: 'ru' })
  })
});

const data = await response.json();
console.log(data); // { id: 1, key: "user_settings", ... }`}</pre>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary">Python</Badge>
                        <span className="text-sm text-muted-foreground">Получение всех записей</span>
                      </div>
                      <div className="bg-card border rounded-lg p-4 font-mono text-sm overflow-x-auto">
<pre className="text-foreground">{`import requests

# Получить все записи
response = requests.get(
    'https://api.cloudstore.dev/data',
    headers={'X-Auth-Token': 'YOUR_JWT_TOKEN'}
)

data = response.json()
for record in data['data']:
    print(f"{record['key']}: {record['value']}")`}</pre>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </section>

          <section id="auth-section" className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <Card className="p-8 md:p-12">
                  <h2 className="text-3xl font-bold mb-2 text-center">Начать за 30 секунд</h2>
                  <p className="text-center text-muted-foreground mb-8">
                    Бесплатная регистрация. Без подтверждения email.
                  </p>
                  
                  <Tabs defaultValue="register" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                      <TabsTrigger value="register">Регистрация</TabsTrigger>
                      <TabsTrigger value="login">Вход</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="register" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-name">Имя</Label>
                        <Input 
                          id="register-name" 
                          placeholder="Иван Иванов"
                          value={registerName}
                          onChange={(e) => setRegisterName(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <Input 
                          id="register-email" 
                          type="email" 
                          placeholder="ivan@example.com"
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password">Пароль</Label>
                        <Input 
                          id="register-password" 
                          type="password" 
                          placeholder="Минимум 6 символов"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                      <Button className="w-full" size="lg" onClick={handleRegister} disabled={loading}>
                        <Icon name="UserPlus" size={18} className="mr-2" />
                        {loading ? 'Регистрация...' : 'Создать аккаунт'}
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        Регистрируясь, вы получаете бесплатный доступ к API
                      </p>
                    </TabsContent>
                    
                    <TabsContent value="login" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input 
                          id="login-email" 
                          type="email" 
                          placeholder="ivan@example.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Пароль</Label>
                        <Input 
                          id="login-password" 
                          type="password" 
                          placeholder="Ваш пароль"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                      <Button className="w-full" size="lg" onClick={handleLogin} disabled={loading}>
                        <Icon name="LogIn" size={18} className="mr-2" />
                        {loading ? 'Вход...' : 'Войти'}
                      </Button>
                    </TabsContent>
                  </Tabs>
                </Card>
              </div>
            </div>
          </section>
        </>
      )}

      {activeSection === 'features' && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Возможности платформы</h1>
              <p className="text-xl text-muted-foreground">Всё необходимое для работы с данными</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="p-8 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon name="Shield" className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">JWT авторизация</h3>
                <p className="text-muted-foreground">
                  Безопасная аутентификация с токенами. Каждый пользователь получает уникальный ключ.
                </p>
              </Card>

              <Card className="p-8 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon name="Database" className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Личное хранилище</h3>
                <p className="text-muted-foreground">
                  Данные каждого пользователя изолированы. Полный контроль над своими записями.
                </p>
              </Card>

              <Card className="p-8 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon name="Zap" className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Быстрый API</h3>
                <p className="text-muted-foreground">
                  REST API с минимальной задержкой. Мгновенный отклик на запросы.
                </p>
              </Card>

              <Card className="p-8 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon name="Users" className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Многопользовательский</h3>
                <p className="text-muted-foreground">
                  Неограниченное количество пользователей. Каждый со своим пространством.
                </p>
              </Card>

              <Card className="p-8 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon name="Globe" className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">CORS включен</h3>
                <p className="text-muted-foreground">
                  Подключайтесь из любых веб-приложений. Браузерные запросы работают без проблем.
                </p>
              </Card>

              <Card className="p-8 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon name="Code2" className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Простая интеграция</h3>
                <p className="text-muted-foreground">
                  Работает с любыми языками программирования. Fetch, Axios, Requests - что угодно.
                </p>
              </Card>
            </div>
          </div>
        </section>
      )}

      {activeSection === 'pricing' && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Простые тарифы</h1>
              <p className="text-xl text-muted-foreground">Начните бесплатно, масштабируйтесь по мере роста</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="p-8 hover:shadow-lg transition-all duration-300">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">Бесплатный</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">0₽</span>
                    <span className="text-muted-foreground">/месяц</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-primary mt-0.5" size={20} />
                    <span>До 1000 записей</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-primary mt-0.5" size={20} />
                    <span>10,000 API запросов/месяц</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-primary mt-0.5" size={20} />
                    <span>JWT авторизация</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-primary mt-0.5" size={20} />
                    <span>Базовая поддержка</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline" onClick={scrollToAuth}>Начать бесплатно</Button>
              </Card>

              <Card className="p-8 border-primary shadow-lg relative">
                <Badge className="absolute top-4 right-4">Популярный</Badge>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">Профессионал</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">990₽</span>
                    <span className="text-muted-foreground">/месяц</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-primary mt-0.5" size={20} />
                    <span>До 100,000 записей</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-primary mt-0.5" size={20} />
                    <span>1,000,000 API запросов/месяц</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-primary mt-0.5" size={20} />
                    <span>Приоритетная поддержка</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-primary mt-0.5" size={20} />
                    <span>Резервное копирование</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-primary mt-0.5" size={20} />
                    <span>Аналитика использования</span>
                  </li>
                </ul>
                <Button className="w-full" onClick={scrollToAuth}>Попробовать Pro</Button>
              </Card>

              <Card className="p-8 hover:shadow-lg transition-all duration-300">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">Бизнес</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">4990₽</span>
                    <span className="text-muted-foreground">/месяц</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-primary mt-0.5" size={20} />
                    <span>Неограниченно записей</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-primary mt-0.5" size={20} />
                    <span>Неограниченно запросов</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-primary mt-0.5" size={20} />
                    <span>VIP поддержка 24/7</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-primary mt-0.5" size={20} />
                    <span>Выделенная инфраструктура</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-primary mt-0.5" size={20} />
                    <span>SLA 99.99%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="text-primary mt-0.5" size={20} />
                    <span>Персональный менеджер</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline" onClick={scrollToAuth}>Связаться с нами</Button>
              </Card>
            </div>
          </div>
        </section>
      )}

      {activeSection === 'api' && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">API Документация</h1>
                <p className="text-xl text-muted-foreground">
                  REST API для управления данными пользователей
                </p>
              </div>

              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Badge className="bg-blue-500">POST</Badge>
                    <div className="flex-1">
                      <code className="text-lg font-mono">/auth/register</code>
                      <p className="text-muted-foreground mt-2">Регистрация нового пользователя</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <pre>{`curl -X POST https://functions.poehali.dev/YOUR_FUNCTION_ID/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Иван Иванов",
    "email": "ivan@example.com",
    "password": "securepassword"
  }'`}</pre>
                  </div>

                  <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm font-semibold mb-2">Ответ:</p>
                    <pre className="text-sm font-mono">{`{
  "user": {
    "id": "usr_123",
    "name": "Иван Иванов",
    "email": "ivan@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`}</pre>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Badge className="bg-green-500">GET</Badge>
                    <div className="flex-1">
                      <code className="text-lg font-mono">/data</code>
                      <p className="text-muted-foreground mt-2">Получить все записи пользователя</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <pre>{`curl -X GET https://functions.poehali.dev/YOUR_FUNCTION_ID/data \\
  -H "X-Auth-Token: YOUR_JWT_TOKEN"`}</pre>
                  </div>

                  <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm font-semibold mb-2">Ответ:</p>
                    <pre className="text-sm font-mono">{`{
  "data": [
    {
      "id": 1,
      "key": "user_settings",
      "value": "{\\"theme\\":\\"dark\\"}",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}`}</pre>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Badge className="bg-blue-500">POST</Badge>
                    <div className="flex-1">
                      <code className="text-lg font-mono">/data</code>
                      <p className="text-muted-foreground mt-2">Создать новую запись</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <pre>{`curl -X POST https://functions.poehali.dev/YOUR_FUNCTION_ID/data \\
  -H "Content-Type: application/json" \\
  -H "X-Auth-Token: YOUR_JWT_TOKEN" \\
  -d '{
    "key": "user_settings",
    "value": "{\\"theme\\":\\"dark\\"}"
  }'`}</pre>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Badge className="bg-orange-500">PUT</Badge>
                    <div className="flex-1">
                      <code className="text-lg font-mono">/data</code>
                      <p className="text-muted-foreground mt-2">Обновить запись</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <pre>{`curl -X PUT https://functions.poehali.dev/YOUR_FUNCTION_ID/data \\
  -H "Content-Type: application/json" \\
  -H "X-Auth-Token: YOUR_JWT_TOKEN" \\
  -d '{
    "id": 1,
    "value": "{\\"theme\\":\\"light\\"}"
  }'`}</pre>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Badge className="bg-red-500">DELETE</Badge>
                    <div className="flex-1">
                      <code className="text-lg font-mono">/data?id=1</code>
                      <p className="text-muted-foreground mt-2">Удалить запись</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <pre>{`curl -X DELETE https://functions.poehali.dev/YOUR_FUNCTION_ID/data?id=1 \\
  -H "X-Auth-Token: YOUR_JWT_TOKEN"`}</pre>
                  </div>
                </Card>

                <Card className="p-6 bg-primary/5 border-primary/20">
                  <div className="flex items-start gap-3">
                    <Icon name="Info" className="text-primary mt-1" size={20} />
                    <div>
                      <h3 className="font-semibold mb-2">Важная информация</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Все запросы (кроме регистрации/входа) требуют токен в заголовке X-Auth-Token</li>
                        <li>• Каждый пользователь видит только свои записи</li>
                        <li>• Токен действителен бессрочно, храните его в безопасности</li>
                        <li>• CORS включен - можно делать запросы из браузера</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      )}

      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Icon name="Database" className="text-primary" size={24} />
              <span className="font-semibold">CloudStore API</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2024 CloudStore. Многопользовательское облачное хранилище данных.
            </p>
            
            <div className="flex gap-4">
              <Button variant="ghost" size="icon">
                <Icon name="Github" size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="Mail" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
