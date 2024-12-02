# INF1407-G2-Frontend

# ToDo List

Repositório do Trabalho 2 da disciplina **INF1407 | Programação para Web**

## Membros
- **Matheus S. Moreira** - 1912947
- **Victor Letichevsky** - 2020701

Desenvolvemos um site para servir como uma lista de afazeres, ajudando a organizar tarefas. O projeto foi implementado usando **HTML**, **CSS** e **Typescript** para o frontend e **Python** com o framework **Django** para o backend em um repositório separado. O site está hospedado em uma instância da **AWS**, permitindo o acesso de qualquer lugar.

## Funcionalidades
- Cadastro de novos usuários
- Login de usuários existentes
- Adicionar novas tarefas
- Marcar tarefas como concluídas
- Excluir tarefas

## Manual do Usuário

### Caso o usuário **não tenha cadastro**:
1. Na tela inicial, entre com os dados da mesma forma que um processo de login.
2. Insira um **username**.
3. Crie uma **senha**.
4. Com o cadastro bem-sucedido, será feito o **login** ao clicar em **Sign up / Login**.

### Caso o usuário **já tenha cadastro**:
1. Na tela inicial, insira seu **nome de usuário** e **senha** e clique em **Sign up / Login**.

### Adicionar Tarefas:
1. Após o login, digite o **nome da tarefa** no campo apropriado e clique em **Add**.

    1.1 Caso o nome da tarefa seja vazio, uma mensaagem de alerta será exibida e a tarefa não será criada.
2. Para **marcar como concluída**, clique no checkbox ao lado da tarefa.
3. Para **apagar** uma tarefa, clique no ícone de **lixeira**.

---

Projeto hospedado na AWS para fácil acesso de qualquer dispositivo com internet.

## Observações Gerais do Projeto

Conseguimos implementar as funcionalidades de **cadastro**, **login** e **logout**. A funcionalidade de **adicionar tarefas** está funcionando como esperado: conseguimos adicionar uma tarefa, **atualizar** ela para concluída e **apagar** ela. Além disso, subimos a aplicação para rodar na AWS, o que facilita muito o acesso da aplicação em qualquer dispositivo com internet.