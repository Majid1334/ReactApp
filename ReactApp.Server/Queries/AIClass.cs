using Azure;
using Microsoft.Data.SqlClient;
using OpenAI;
using OpenAI.Chat;
using OpenAI.Graders;
using ReactApp.Server.Data;
using ReactApp.Server.OutgoingModels;
using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Numerics;
using System.Runtime.Intrinsics.X86;
using System.Threading.Tasks;
using System.Xml.Linq;
using static Azure.Core.HttpHeader;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ReactApp.Server.Queries
{
    public class AIClass
    {
        public async Task<string> GetProcessDiagram(string ProcessName, string aiKey)
        {
            try
            {
                var chatClient = new ChatClient(model: "gpt-4o", apiKey: aiKey);
                var messages = new List<ChatMessage>
                {
                    ChatMessage.CreateSystemMessage(
                    "1. You are an ITIL and ITSM professional."+
                    "2. I want a BPMN process diagram."+
                    "3. The output must use swimlanes."+
                    "4. Each swimlane must represent a different role involved in the process."+
                    "5. The process must contain at least 20 detailed steps."+
                    "6. The output must be in JSON format."+
                    "7. The JSON must follow this exact structure:"+
                    "      process → pool → lanes → elements → sequenceFlows"+
                    "8. Include subprocesses where appropriate."+
                    "9. The diagram must be detailed, accurate, comprehensive, clear, concise, and informative."+
                    "10. No extra fields, no styling, no formatting metadata."+
                    "11. Every element must include ONLY:"+
                    "      - id"+
                    "      - type"+
                    "      - name"+
                    "12. Valid element types are:"+
                    "      - bpmn:StartEvent"+
                    "      - bpmn:EndEvent"+
                    "      - bpmn:Task"+
                    "      - bpmn:ExclusiveGateway"+
                    "      - bpmn:SubProcess"+
                    "13. Gateways must use the type 'bpmn:ExclusiveGateway'."+
                    "14. Every sequenceFlow must include:"+
                    "      - from"+
                    "      - to"+
                    "      - condition (only if applicable)"+
                    "15. The JSON must always include these top-level fields:"+
                    "      - process.id"+
                    "      - process.name"+
                    "      - process.type"+
                    "      - process.pool.id"+
                    "      - process.pool.name"+
                    "      - process.pool.lanes"+
                    "      - process.sequenceFlows"+
                    "16. process.type must always be 'bpmn:Process'."+
                    "17. Lane objects must always include:"+
                    "      - id"+
                    "      - name"+
                    "      - elements"+
                    "18. All ids must use snake_case."+
                    "19. The JSON must be minimal, stable, predictable, and import‑friendly."+
                    "20. The JSON must NOT be compressed; it must be human‑readable with indentation."+
                    "21. The output must contain ONLY valid JSON."+
                    "22. Do NOT include code fences such as ```json or ```."+
                    "23. Do NOT include explanations, comments, or any text outside the JSON object."+
                    "24. The response must begin with '{' and end with '}' with no characters before or after."+
                    "25. If the output is not valid JSON, regenerate it until it is valid."+
                    "26. The output must be a single JSON object. No arrays at the top level. No markdown. No backticks."+
                    "27. The content of the process must be based on the process name I provide."+
                    "28. All sequenceFlows.from and sequenceFlows.to must reference valid element ids defined in process.pool.lanes[].elements."+
                    "29. Do NOT reference lanes, pools, or sequenceFlows in from or to. Only element IDs are allowed."+
                    "30. All element ids must be unique across the entire process."+
                    "31. The process must be acyclic: do NOT create circular paths or loops in sequenceFlows."+
                    "32. Do NOT create any sequenceFlow where from and to are the same id."+
                    "33. There must be at least one bpmn:StartEvent and one bpmn:EndEvent."+
                    "34. No sequenceFlow may originate from an EndEvent or terminate at a StartEvent."+
                    "35. replace all 'sourceID' with 'from' and 'targetID' with 'to' in final result."
                    ),
                    ChatMessage.CreateUserMessage($"Please provide the process diagram for the process named '{ProcessName}'.")
                };

                // Await the result and access the Value property instead of Result
                var chatResult = await chatClient.CompleteChatAsync(messages);
                var completion = chatResult.Value;

                // TODO: Parse the completion.Content to create DiagramImageModel(s)
                // Placeholder: return an empty list for now
                return completion.Content[0].Text;
            }
            catch
            {
                throw;
            }
        }
    }
}
