import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Types
type RequestType = 'evaluateTreaty' | 'nationResponse' | 'generateNews';

interface RequestBody {
  gameState: any;
  action: any;
  requestType: RequestType;
}

// Helper functions
function createSystemPrompt(requestType: RequestType, gameState: any): string {
  const prompts: Record<RequestType, string> = {
    evaluateTreaty: `You are the game engine for a treaty writing simulator focused on a water rights crisis between three nations.

GAME CONTEXT:
Three nations share the Nerin River basin during a severe drought:
- Tuvana (upstream): Recently built a major dam for hydroelectric power
- Alaria (midstream): Agricultural economy dependent on river irrigation
- Meridian (downstream): Mix of urban centers and farming communities

Your task is to evaluate the treaty text provided by the player and identify potential loopholes, ambiguities, or issues that the nations might exploit based on their interests.

Analyze the treaty for:
1. Clarity of language
2. Specific obligations vs vague commitments
3. Monitoring and enforcement mechanisms
4. Definitions that could be interpreted differently
5. Omissions that could be exploited

Respond with a JSON array of issues found, including which nation might exploit each issue and how.`,

    nationResponse: `You are simulating the responses of three nations to a proposed water allocation treaty during a drought crisis.

GAME CONTEXT:
Three nations share the Nerin River basin during a severe drought:
- Tuvana (upstream): Recently built a major dam for hydroelectric power
- Alaria (midstream): Agricultural economy dependent on river irrigation
- Meridian (downstream): Mix of urban centers and farming communities

Your task is to generate realistic responses from each nation to the treaty text provided by the player. Each nation should respond according to their interests and position.

Tuvana's interests:
- Maintain control over dam operations
- Maximize hydroelectric production
- Support industrial development
- Maintain sovereignty over water resources

Alaria's interests:
- Secure reliable water for agricultural irrigation
- Protect farming communities
- Seek compensation for any crop losses
- Maintain agricultural export markets

Meridian's interests:
- Ensure sufficient water flow for urban centers
- Maintain water quality standards
- Protect downstream ecosystems
- Prevent flooding or drought extremes

Respond with a JSON array of three objects, each containing a nation's name and their diplomatic response to the treaty. Focus on how each nation interprets the treaty language according to their interests.`,

    generateNews: `You are generating a simulation of news events following the implementation of a water allocation treaty between three nations during a drought crisis.

GAME CONTEXT:
Three nations share the Nerin River basin during a severe drought:
- Tuvana (upstream): Recently built a major dam for hydroelectric power
- Alaria (midstream): Agricultural economy dependent on river irrigation
- Meridian (downstream): Mix of urban centers and farming communities

The player has drafted a treaty addressing water allocation during the crisis. Based on the treaty text and any correspondence, simulate how events unfold over a two-week period as the nations interpret and implement the treaty.

Focus on:
1. How treaty language is interpreted (or misinterpreted)
2. Loopholes that nations exploit
3. Unforeseen consequences
4. Regional impacts on communities
5. Escalation or de-escalation of tensions

Respond with a JSON array of news items spanning 14 days. Each news item should include:
- day (number): Day since treaty implementation
- headline (string): News headline
- content (string): News content
- source (string): News source (e.g., "Tuvana Herald", "Alaria Times", "Meridian Daily", "Regional News Network")
- sentiment (string): "positive" or "negative" impact

Show how the treaty's language directly influences events. Include both positive outcomes and unexpected problems.`
  };

  return prompts[requestType] || prompts.evaluateTreaty;
}

// API endpoint
// Explicitly type the async handler to match express expectations
app.post('/api/model', async (req: express.Request<{}, any, Omit<RequestBody, 'apiKey'>, {}>, res: express.Response): Promise<void> => {
  try {
    const { gameState, action, requestType } = req.body;
    
    // Rely solely on the environment variable for the API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('Anthropic API key is not configured on the server.');
      res.status(500).json({ error: 'API key configuration error' }); // Use 500 for server config issues
      return; // Ensure function exits
    }
    
    // Create appropriate system prompt based on request type
    const systemPrompt = createSystemPrompt(requestType, gameState);
    
    // Prepare the payload for Claude
    const payload = {
      model: "claude-3-7-sonnet-20250219", // Corrected model name based on error
      system: systemPrompt,
      messages: [
        { 
          role: "user", 
          content: JSON.stringify({ 
            gameState, 
            action,
            requestDetails: {
              type: requestType,
              timestamp: new Date().toISOString()
            }
          })
        }
      ],
      max_tokens: 4000,
      temperature: 0.7
    };
    
    console.log(`Calling Claude API for request type: ${requestType}`);
    
    // Call Anthropic API
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey, // Use the server-side key
          'anthropic-version': '2023-06-01'
        }
      }
    );
    
    // Extract and parse the response
    let content = response.data.content[0].text;
    
    // Try to extract and parse JSON from the response
    try {
      // Look for JSON in the response using various patterns
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                        content.match(/```\n([\s\S]*?)\n```/) ||
                        content.match(/\[([\s\S]*?)\]/) || 
                        content.match(/\{([\s\S]*?)\}/);
      
      if (jsonMatch) {
        // Extract the matched content (which should be JSON)
        const jsonString = jsonMatch[0].replace(/```json\n/, '').replace(/```\n/, '').replace(/\n```/, '');
        
        // Try to parse it
        try {
          content = JSON.parse(jsonString);
        } catch (parseError) {
          console.error('Error parsing extracted JSON:', parseError);
          console.log('Extracted content that failed to parse:', jsonString);
          // Keep original content if parsing fails
        }
      } else {
        // If no clear JSON pattern is found, try to parse the entire content
        // (Claude sometimes returns clean JSON without markdown)
        try {
          const parsedContent = JSON.parse(content);
          content = parsedContent;
        } catch (directParseError) {
          // That's fine, just use the text content
          console.log('No JSON structure found in response, using text');
        }
      }
    } catch (error) {
      console.error('Error extracting JSON from Claude response:', error);
      // Fall back to using the raw text
    }
    
    res.json({ result: content });
  } catch (error) {
    console.error('Error calling Claude API:', error);
    // Check if the error is an Axios error to provide more details
    if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ 
            error: 'Error communicating with AI service', 
            details: error.response?.data?.error?.message || error.message 
        });
    } else {
        res.status(500).json({ error: 'Internal server error processing request' });
    }
  }
});

// Serve the main HTML file
app.get('/', (req: express.Request, res: express.Response): void => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});