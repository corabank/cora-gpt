#!/usr/bin/env node

import fs from "fs/promises";
import inquirer from "inquirer";
import { Configuration, OpenAIApi } from "openai";


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const menuOptions = [
  {
    type: "list",
    name: "action",
    message: `

  ██████╗ ██████╗ ██████╗  █████╗        ██████╗ ██████╗ ████████╗
  ██╔════╝██╔═══██╗██╔══██╗██╔══██╗      ██╔════╝ ██╔══██╗╚══██╔══╝
  ██║     ██║   ██║██████╔╝███████║█████╗██║  ███╗██████╔╝   ██║   
  ██║     ██║   ██║██╔══██╗██╔══██║╚════╝██║   ██║██╔═══╝    ██║   
  ╚██████╗╚██████╔╝██║  ██║██║  ██║      ╚██████╔╝██║        ██║   
  ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝       ╚═════╝ ╚═╝        ╚═╝   
  A development tool that uses OpenAI for Cora engineers.

    `,
    choices: [
      { name: "🚀 Init project", value: "init" },
      { name: "➕ Add new set of rules (standards)", value: "addRules" },
      { name: "📝 Edit set of rules (standards)", value: "editRules" },
      { name: "💼 Implement new use case", value: "implementUseCase" },
      { name: "🔍 Verify compliance with our standards", value: "verifyCompliance" },
      { name: "❌ Exit", value: "exit" },
    ],
  },
];

async function createUseCase(kind, usecase) {
  console.log("\nWait, we're generating the source code...");

  const rule = await fs.readFile(`rules/${kind}.txt`, "utf-8");

  const gptPrompt = `
    We have this rules:
    ${rule}

    Now I want to implement the below use case:
    ${usecase}

    YOU MUST ANSWER WITH A JSON WITHIN BLOCKQUOTES FOLLOWING THIS FORMAT:` + '```[{"file_path":"use_case_1/.../file_1.go", "contents": "// source code here"},{...}]```'
  ;

  // console.log(gptPrompt);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      // {role: "system", content: 'You are an software engineer. You use helpful comments in your code. You always answer with JSON using this format: ```[{"file_path":"use_case_1/.../file_1.go", "contents": "// source code here"},{...}]```'},
      {role: "user", content: gptPrompt}
    ],
  });

  let completionContent = completion.data.choices[0].message.content;
  // console.log(completionContent);
  if (!completionContent.startsWith("[")) {
    const matches = /```(?:json|javascript|js)?\n([\s\S]*?)```/g.exec(completionContent);
    completionContent = matches[matches.length - 1].replace('```json\n', '').replace('\n```', '');
  }
  let files = null;
  try {
    files = JSON.parse(completionContent);
  } catch(e) {
    files = completionContent;
  }

  const outputBasePath = `./output/${new Date().getTime()}-${kind}`;
  for (const file of files) {
    const path = `${outputBasePath}/${file.file_path}`;
    const dir = path.substring(0, path.lastIndexOf('/'));

    console.log(`writing file: ${path}`);

    await fs.mkdir(dir, { recursive: true }).catch(console.log);
    await fs.writeFile(path, file.contents, {encoding: 'utf-8'}).catch(console.log);    
  }

  console.log("\nUsecase genenerated!\n\n");
}

async function main() {
  while (true) {
    const { action } = await inquirer.prompt(menuOptions);

    switch (action) {
      case "init":
        console.log("Iniciando projeto...");
        // Implemente a lógica para iniciar o projeto aqui
        break;
      case "addRules":
        console.log("Adicionando novo conjunto de regras...");
        // Implemente a lógica para adicionar novas regras aqui
        break;
      case "editRules":
        console.log("Editando conjunto de regras...");
        // Implemente a lógica para editar as regras aqui
        break;
      case "implementUseCase":
        const { kind } = await inquirer.prompt({
          type: "list",
          name: "kind",
          message: "What kind of usecase do you need?",
          choices: ["hexagonal", "streamlit", "ci-pipeline", "data-pipeline"],
        });

        const { usecase } = await inquirer.prompt({
          type: "input",
          name: "usecase",
          message: "Tell me about the about your usecase:"
        });

        // const kind = "hexagonal"

        await createUseCase(kind, usecase);

        break;
      case "verifyCompliance":
        console.log("Verificando conformidade com nossos padrões...");
        // Implemente a lógica para verificar a conformidade aqui
        break;
      case "exit":
        console.log("Saindo...");
        process.exit(0);
    }
  }
}

main();
