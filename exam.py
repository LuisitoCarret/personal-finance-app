list_tasks = []
id = 0
menu = """
Manage of tasks

What do you want to do?
1.Create Task
2.List Tasks
3.Check task as completed
4.Delete task
5.Exit
"""
while (response := input(menu)) != '':
     if response == '1':
          id+=1
          name_task = input('Enter a name for the task: ')
          description = input('Enter a description for the task: ')
          task = {'id': id,'name':name_task,'description':description,'completed':False}
          list_tasks.append(task)
          print(task)
     elif response == '2':
          print(list_tasks)
     elif response == '3':
          id_task_search = int(input('Enter the id of the task for search: '))
          for tsk in list_tasks:
               if tsk['id'] == id_task_search:
                    tsk['completed'] = True
                    print('Task completed')
     elif response == '4':
          id_task_delete = int(input('Enter the id of the task for delete: '))
          for tsk in list_tasks:
             if tsk['id'] == id_task_delete:
                  list_tasks.remove(tsk)
                  print('Task deleted')
     elif response == '5':
          break