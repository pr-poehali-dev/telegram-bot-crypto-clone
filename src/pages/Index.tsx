import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface Asset {
  symbol: string;
  name: string;
  balance: number;
  price: number;
  change24h: number;
}

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'exchange';
  asset: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending';
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  const assets: Asset[] = [
    { symbol: 'BTC', name: 'Bitcoin', balance: 0.00234, price: 43250, change24h: 2.4 },
    { symbol: 'ETH', name: 'Ethereum', balance: 0.432, price: 2280, change24h: -1.2 },
    { symbol: 'USDT', name: 'Tether', balance: 1250.50, price: 1, change24h: 0.0 },
    { symbol: 'TON', name: 'Toncoin', balance: 125.8, price: 2.45, change24h: 5.3 },
  ];

  const transactions: Transaction[] = [
    { id: '1', type: 'receive', asset: 'BTC', amount: 0.001, date: '2024-11-04', status: 'completed' },
    { id: '2', type: 'exchange', asset: 'ETH', amount: 0.2, date: '2024-11-03', status: 'completed' },
    { id: '3', type: 'send', asset: 'USDT', amount: 150, date: '2024-11-02', status: 'completed' },
  ];

  const totalBalance = assets.reduce((sum, asset) => sum + (asset.balance * asset.price), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] via-[#1A1F2C] to-[#2A1F3C] text-foreground">
      <div className="max-w-md mx-auto pb-20">
        <div className="p-6 pt-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Icon name="Wallet" size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-bold">CryptoBot</h1>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Icon name="Settings" size={20} />
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-card/50 backdrop-blur-sm">
              <TabsTrigger value="home" className="data-[state=active]:bg-primary/20">
                <Icon name="Home" size={18} className="mr-2" />
                Главная
              </TabsTrigger>
              <TabsTrigger value="exchange" className="data-[state=active]:bg-primary/20">
                <Icon name="ArrowLeftRight" size={18} className="mr-2" />
                Обмен
              </TabsTrigger>
              <TabsTrigger value="wallet" className="data-[state=active]:bg-primary/20">
                <Icon name="Wallet" size={18} className="mr-2" />
                Кошелёк
              </TabsTrigger>
            </TabsList>

            <TabsContent value="home" className="space-y-6 animate-fade-in">
              <Card className="p-6 bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30 backdrop-blur-sm">
                <p className="text-sm text-muted-foreground mb-2">Общий баланс</p>
                <h2 className="text-4xl font-bold mb-4">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                <div className="flex gap-3">
                  <Button className="flex-1 bg-primary hover:bg-primary/90">
                    <Icon name="Send" size={18} className="mr-2" />
                    Отправить
                  </Button>
                  <Button className="flex-1 bg-secondary hover:bg-secondary/90">
                    <Icon name="Download" size={18} className="mr-2" />
                    Получить
                  </Button>
                </div>
              </Card>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold px-1">Быстрые действия</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Card className="p-4 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all cursor-pointer hover-scale">
                    <Icon name="Repeat" size={24} className="text-primary mb-2" />
                    <p className="font-medium">Обменять</p>
                    <p className="text-xs text-muted-foreground">Криптовалюту</p>
                  </Card>
                  <Card className="p-4 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all cursor-pointer hover-scale">
                    <Icon name="TrendingUp" size={24} className="text-secondary mb-2" />
                    <p className="font-medium">Купить</p>
                    <p className="text-xs text-muted-foreground">За карту</p>
                  </Card>
                  <Card className="p-4 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all cursor-pointer hover-scale">
                    <Icon name="QrCode" size={24} className="text-primary mb-2" />
                    <p className="font-medium">QR-код</p>
                    <p className="text-xs text-muted-foreground">Для приёма</p>
                  </Card>
                  <Card className="p-4 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all cursor-pointer hover-scale">
                    <Icon name="History" size={24} className="text-secondary mb-2" />
                    <p className="font-medium">История</p>
                    <p className="text-xs text-muted-foreground">Транзакций</p>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="exchange" className="space-y-6 animate-fade-in">
              <Card className="p-6 bg-card/50 backdrop-blur-sm">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Отдаёте</label>
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50">
                      <Button variant="outline" className="gap-2">
                        <Icon name="Bitcoin" size={20} className="text-primary" />
                        BTC
                        <Icon name="ChevronDown" size={16} />
                      </Button>
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        className="flex-1 bg-transparent text-right text-xl font-semibold outline-none"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-right">≈ $0.00</p>
                  </div>

                  <div className="flex justify-center">
                    <Button size="icon" variant="ghost" className="rounded-full bg-primary/20">
                      <Icon name="ArrowUpDown" size={20} />
                    </Button>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Получаете</label>
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50">
                      <Button variant="outline" className="gap-2">
                        <Icon name="Coins" size={20} className="text-secondary" />
                        USDT
                        <Icon name="ChevronDown" size={16} />
                      </Button>
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        className="flex-1 bg-transparent text-right text-xl font-semibold outline-none"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-right">≈ $0.00</p>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-muted/30 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Курс</span>
                    <span className="font-medium">1 BTC ≈ 43,250 USDT</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Комиссия</span>
                    <span className="font-medium">0.1%</span>
                  </div>
                </div>

                <Button className="w-full mt-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-semibold py-6">
                  Обменять
                </Button>
              </Card>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold px-1">Популярные пары</h3>
                {assets.slice(0, 3).map((asset) => (
                  <Card 
                    key={asset.symbol} 
                    className="p-4 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <span className="text-sm font-bold">{asset.symbol}</span>
                        </div>
                        <div>
                          <p className="font-semibold">{asset.symbol}/USDT</p>
                          <p className="text-sm text-muted-foreground">{asset.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${asset.price.toLocaleString()}</p>
                        <Badge 
                          variant={asset.change24h >= 0 ? "default" : "destructive"}
                          className={asset.change24h >= 0 ? "bg-green-500/20 text-green-400" : ""}
                        >
                          {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="wallet" className="space-y-6 animate-fade-in">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold px-1">Мои активы</h3>
                {assets.map((asset) => (
                  <Card 
                    key={asset.symbol} 
                    className="p-4 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all cursor-pointer"
                    onClick={() => setSelectedAsset(asset.symbol)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <span className="font-bold">{asset.symbol}</span>
                        </div>
                        <div>
                          <p className="font-semibold">{asset.name}</p>
                          <p className="text-sm text-muted-foreground">{asset.balance} {asset.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(asset.balance * asset.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                        <Badge 
                          variant={asset.change24h >= 0 ? "default" : "destructive"}
                          className={asset.change24h >= 0 ? "bg-green-500/20 text-green-400" : ""}
                        >
                          {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold px-1">Последние транзакции</h3>
                {transactions.map((tx) => (
                  <Card key={tx.id} className="p-4 bg-card/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'receive' ? 'bg-green-500/20' : 
                          tx.type === 'send' ? 'bg-red-500/20' : 'bg-primary/20'
                        }`}>
                          <Icon 
                            name={tx.type === 'receive' ? 'ArrowDownLeft' : tx.type === 'send' ? 'ArrowUpRight' : 'Repeat'} 
                            size={18}
                            className={
                              tx.type === 'receive' ? 'text-green-400' : 
                              tx.type === 'send' ? 'text-red-400' : 'text-primary'
                            }
                          />
                        </div>
                        <div>
                          <p className="font-semibold">
                            {tx.type === 'receive' ? 'Получено' : tx.type === 'send' ? 'Отправлено' : 'Обменяно'}
                          </p>
                          <p className="text-sm text-muted-foreground">{tx.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {tx.type === 'receive' ? '+' : '-'}{tx.amount} {tx.asset}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {tx.status === 'completed' ? 'Завершено' : 'В обработке'}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
