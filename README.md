# 📱 App Já Pagou?
<a href="https://imgur.com/y9IeSyO"><img src="https://i.imgur.com/y9IeSyO.png" title="source: imgur.com" /></a>

> Como surgiu a ideia?  <br>
A ideia de criar o "Já Pagou?" foi a atender a necessidade do meu pai, um senhor com mais de 60 anos, que precisava lembrar a data de pagamento de alguma fatura, ele sempre deixava passar um ou dois dias, as vezes mais e então pagava com juros, isso o frustava muito, então perguntei para ele "pai, se você tivesse um aplicativo que te lembra-se do vencimento de uma conta, ajudaria?", "com certezaaa... e eu me livraria do meu caderninho kkk" 

## Resumo das funcionalidades
Aqui está um resumo das funcionalidades implementadas:
   - Filtros de busca na Home
   - Adicionar nova conta
   - Habilitar notificação em uma conta
   - Editar conta existente
   - Excluir conta
   - Marcar como paga/não paga

home.tsx:
   - Lista todas as contas cadastradas
   - Mostra título, valor e data de vencimento de cada conta
   - Botões para editar e excluir cada conta
   - Botão para adicionar nova conta

add.tsx:
   - Formulário para adicionar nova conta
   - Campos para título, valor, data de vencimento
   - Seletor de data e hora para a notificação
   - Salva os dados no AsyncStorage
   - Agenda uma notificação para a data/hora escolhida
   
edit.tsx:
   - Formulário para editar conta existente
   - Mesmos campos do Add.tsx
   - Atualiza os dados no AsyncStorage
   - Atualiza a notificação agendada

App.tsx:
   - Configuração da navegação entre telas
   - Configuração inicial das notificações
   - Solicita permissão para enviar notificações


Para usar o aplicativo:
   Na tela inicial, você verá a lista de todas as suas contas
   Clique no botão "Adicionar Conta" para cadastrar uma nova conta
   Preencha os dados da conta e escolha quando quer receber a notificação
   Para editar uma conta, clique no botão "Editar" na conta desejada
   Para excluir uma conta, clique no botão "Excluir"
   O aplicativo irá notificar você no dia e hora escolhidos para cada conta.


## Get started
This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start   or   npx expo start --clear
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
