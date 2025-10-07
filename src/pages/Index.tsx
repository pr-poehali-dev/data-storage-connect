import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Database" className="text-primary" size={28} />
            <span className="text-xl font-bold">CloudStore</span>
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
              onClick={() => setActiveSection('api')}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                activeSection === 'api' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              API
            </button>
          </div>

          <Button className="hidden md:flex">Войти</Button>
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
                  Быстрый и надежный
                </Badge>
                
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                  Облачное хранилище
                  <span className="block text-primary mt-2">для ваших данных</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                  Подключайтесь через API и храните данные безопасно. JWT авторизация из коробки.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button size="lg" className="text-base">
                    <Icon name="Rocket" size={18} className="mr-2" />
                    Начать бесплатно
                  </Button>
                  <Button size="lg" variant="outline" className="text-base" onClick={() => setActiveSection('api')}>
                    <Icon name="Code" size={18} className="mr-2" />
                    Документация API
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Почему CloudStore?</h2>
                <p className="text-lg text-muted-foreground">Всё что нужно для работы с данными</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon name="Shield" className="text-primary" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">JWT авторизация</h3>
                  <p className="text-muted-foreground">
                    Безопасная аутентификация с токенами. Защита данных на уровне индустрии.
                  </p>
                </Card>

                <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon name="Zap" className="text-primary" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Быстрый API</h3>
                  <p className="text-muted-foreground">
                    RESTful API с минимальной задержкой. Работает молниеносно быстро.
                  </p>
                </Card>

                <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon name="Database" className="text-primary" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Надежное хранение</h3>
                  <p className="text-muted-foreground">
                    Ваши данные в безопасности. Резервное копирование и шифрование.
                  </p>
                </Card>
              </div>
            </div>
          </section>

          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <Card className="p-8 md:p-12">
                  <h2 className="text-3xl font-bold mb-8 text-center">Авторизация</h2>
                  
                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                      <TabsTrigger value="login">Вход</TabsTrigger>
                      <TabsTrigger value="register">Регистрация</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="login" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input id="login-email" type="email" placeholder="your@email.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Пароль</Label>
                        <Input id="login-password" type="password" placeholder="••••••••" />
                      </div>
                      <Button className="w-full" size="lg">
                        <Icon name="LogIn" size={18} className="mr-2" />
                        Войти
                      </Button>
                    </TabsContent>
                    
                    <TabsContent value="register" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-name">Имя</Label>
                        <Input id="register-name" placeholder="Ваше имя" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <Input id="register-email" type="email" placeholder="your@email.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password">Пароль</Label>
                        <Input id="register-password" type="password" placeholder="••••••••" />
                      </div>
                      <Button className="w-full" size="lg">
                        <Icon name="UserPlus" size={18} className="mr-2" />
                        Зарегистрироваться
                      </Button>
                    </TabsContent>
                  </Tabs>
                </Card>
              </div>
            </div>
          </section>
        </>
      )}

      {activeSection === 'api' && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">API Документация</h1>
                <p className="text-xl text-muted-foreground">
                  Простой и понятный REST API для работы с данными
                </p>
              </div>

              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Badge className="bg-green-500">GET</Badge>
                    <div className="flex-1">
                      <code className="text-lg font-mono">/api/users/:id</code>
                      <p className="text-muted-foreground mt-2">Получить данные пользователя по ID</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <pre>{`curl -X GET https://api.cloudstore.dev/users/123 \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`}</pre>
                  </div>

                  <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm font-semibold mb-2">Ответ:</p>
                    <pre className="text-sm font-mono">{`{
  "id": "123",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-15T10:30:00Z"
}`}</pre>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Badge className="bg-blue-500">POST</Badge>
                    <div className="flex-1">
                      <code className="text-lg font-mono">/api/data</code>
                      <p className="text-muted-foreground mt-2">Создать новую запись</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <pre>{`curl -X POST https://api.cloudstore.dev/data \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"key": "value", "data": "example"}'`}</pre>
                  </div>

                  <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm font-semibold mb-2">Ответ:</p>
                    <pre className="text-sm font-mono">{`{
  "id": "abc123",
  "key": "value",
  "data": "example",
  "status": "created"
}`}</pre>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Badge className="bg-orange-500">PUT</Badge>
                    <div className="flex-1">
                      <code className="text-lg font-mono">/api/data/:id</code>
                      <p className="text-muted-foreground mt-2">Обновить существующую запись</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <pre>{`curl -X PUT https://api.cloudstore.dev/data/abc123 \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"key": "updated_value"}'`}</pre>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Badge className="bg-red-500">DELETE</Badge>
                    <div className="flex-1">
                      <code className="text-lg font-mono">/api/data/:id</code>
                      <p className="text-muted-foreground mt-2">Удалить запись</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <pre>{`curl -X DELETE https://api.cloudstore.dev/data/abc123 \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`}</pre>
                  </div>
                </Card>

                <Card className="p-6 bg-primary/5 border-primary/20">
                  <div className="flex items-start gap-3">
                    <Icon name="Info" className="text-primary mt-1" size={20} />
                    <div>
                      <h3 className="font-semibold mb-2">Аутентификация</h3>
                      <p className="text-sm text-muted-foreground">
                        Все запросы требуют JWT токен в заголовке Authorization. 
                        Получите токен через эндпоинт <code className="bg-muted px-1 py-0.5 rounded">/auth/login</code>
                      </p>
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
              <span className="font-semibold">CloudStore</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2024 CloudStore. Надежное облачное хранилище.
            </p>
            
            <div className="flex gap-4">
              <Button variant="ghost" size="icon">
                <Icon name="Github" size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="Twitter" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
