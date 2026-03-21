import { supabaseAdmin } from '@/lib/supabase/server';

const SEED_PROJECTS = [
  // ── Ethereum ──────────────────────────────────
  { id: 'aave', name: 'Aave', slug: 'aave', chain: 'ethereum', category: 'defi', github_repos: ['aave/aave-v3-core', 'aave/interface'], defillama_slug: 'aave', coingecko_id: 'aave', governance_type: 'governor', website: 'https://aave.com', treasury_addresses: { ethereum: ['0x464C71f6c2F760DdA6093dCB91C24c39e5d6e18c'] } },
  { id: 'uniswap', name: 'Uniswap', slug: 'uniswap', chain: 'ethereum', category: 'defi', github_repos: ['Uniswap/v3-core', 'Uniswap/interface'], defillama_slug: 'uniswap', coingecko_id: 'uniswap', governance_type: 'governor', website: 'https://uniswap.org', treasury_addresses: { ethereum: ['0x1a9C8182C09F50C8318d769245beA52c32BE35BC'] } },
  { id: 'lido', name: 'Lido', slug: 'lido', chain: 'ethereum', category: 'defi', github_repos: ['lidofinance/lido-dao', 'lidofinance/core'], defillama_slug: 'lido', coingecko_id: 'lido-dao', governance_type: 'aragon', website: 'https://lido.fi', treasury_addresses: { ethereum: ['0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c'] } },
  { id: 'makerdao', name: 'MakerDAO', slug: 'makerdao', chain: 'ethereum', category: 'defi', github_repos: ['makerdao/dss', 'makerdao/governance-portal-v2'], defillama_slug: 'makerdao', coingecko_id: 'maker', governance_type: 'custom', website: 'https://makerdao.com', treasury_addresses: { ethereum: ['0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB'] } },
  { id: 'compound', name: 'Compound', slug: 'compound', chain: 'ethereum', category: 'defi', github_repos: ['compound-finance/compound-protocol', 'compound-finance/comet'], defillama_slug: 'compound-finance', coingecko_id: 'compound-governance-token', governance_type: 'governor', website: 'https://compound.finance', treasury_addresses: { ethereum: ['0x6d903f6003cca6255D85CcA4D3B5E5146dC33925'] } },
  { id: 'dydx', name: 'dYdX', slug: 'dydx', chain: 'ethereum', category: 'defi', github_repos: ['dydxprotocol/v4-chain'], defillama_slug: 'dydx', coingecko_id: 'dydx-chain', governance_type: 'cosmos-gov', website: 'https://dydx.exchange', treasury_addresses: {} },
  { id: 'sushiswap', name: 'SushiSwap', slug: 'sushiswap', chain: 'ethereum', category: 'defi', github_repos: ['sushiswap/sushiswap'], defillama_slug: 'sushi', coingecko_id: 'sushi', governance_type: 'snapshot', website: 'https://sushi.com', treasury_addresses: { ethereum: ['0xe94B5EEC1fA96CEecbD33EF5Baa8d00E4493F4f3'] } },
  { id: 'pendle', name: 'Pendle', slug: 'pendle', chain: 'ethereum', category: 'defi', github_repos: ['pendle-finance/pendle-core-v2-public'], defillama_slug: 'pendle', coingecko_id: 'pendle', governance_type: 'snapshot', website: 'https://pendle.finance', treasury_addresses: {} },
  { id: 'eigenlayer', name: 'EigenLayer', slug: 'eigenlayer', chain: 'ethereum', category: 'infrastructure', github_repos: ['Layr-Labs/eigenlayer-contracts', 'Layr-Labs/eigenda'], defillama_slug: 'eigenlayer', coingecko_id: 'eigenlayer', governance_type: 'none', website: 'https://eigenlayer.xyz', treasury_addresses: {} },
  { id: 'ethena', name: 'Ethena', slug: 'ethena', chain: 'ethereum', category: 'defi', github_repos: ['ethena-labs/ethena'], defillama_slug: 'ethena', coingecko_id: 'ethena-usde', governance_type: 'none', website: 'https://ethena.fi', treasury_addresses: {} },
  { id: 'ens', name: 'ENS', slug: 'ens', chain: 'ethereum', category: 'infrastructure', github_repos: ['ensdomains/ens-contracts', 'ensdomains/ens-app-v3'], defillama_slug: '', coingecko_id: 'ethereum-name-service', governance_type: 'governor', website: 'https://ens.domains', treasury_addresses: { ethereum: ['0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7'] } },
  { id: 'illuvium', name: 'Illuvium', slug: 'illuvium', chain: 'ethereum', category: 'gamefi', github_repos: [], defillama_slug: '', coingecko_id: 'illuvium', governance_type: 'snapshot', website: 'https://illuvium.io', treasury_addresses: {} },
  { id: 'apecoin', name: 'ApeCoin DAO', slug: 'apecoin', chain: 'ethereum', category: 'dao', github_repos: ['apecoin/governance'], defillama_slug: '', coingecko_id: 'apecoin', governance_type: 'snapshot', website: 'https://apecoin.com', treasury_addresses: { ethereum: ['0xC5a3A1867184190C75F7Ad26B65B054cf9474568'] } },
  { id: 'looksrare', name: 'LooksRare', slug: 'looksrare', chain: 'ethereum', category: 'nft', github_repos: ['LooksRare/contracts-exchange-v2'], defillama_slug: 'looksrare', coingecko_id: 'looksrare', governance_type: 'none', website: 'https://looksrare.org', treasury_addresses: {} },

  // ── Arbitrum (primary ecosystem focus) ────────
  { id: 'arbitrum', name: 'Arbitrum', slug: 'arbitrum', chain: 'arbitrum', category: 'l1-l2', github_repos: ['OffchainLabs/nitro', 'ArbitrumFoundation/governance'], defillama_slug: 'arbitrum', coingecko_id: 'arbitrum', governance_type: 'governor', website: 'https://arbitrum.io', treasury_addresses: { arbitrum: ['0xF3FC178157fb3c87548bAA86F9d24BA38E649B58'] } },
  { id: 'gmx', name: 'GMX', slug: 'gmx', chain: 'arbitrum', category: 'defi', github_repos: ['gmx-io/gmx-interface', 'gmx-io/gmx-synthetics'], defillama_slug: 'gmx', coingecko_id: 'gmx', governance_type: 'snapshot', website: 'https://gmx.io', treasury_addresses: {} },
  { id: 'camelot', name: 'Camelot', slug: 'camelot', chain: 'arbitrum', category: 'defi', github_repos: ['CamelotLabs/core'], defillama_slug: 'camelot', coingecko_id: 'camelot-token', governance_type: 'snapshot', website: 'https://camelot.exchange', treasury_addresses: {} },
  { id: 'radiant', name: 'Radiant Capital', slug: 'radiant', chain: 'arbitrum', category: 'defi', github_repos: ['radiant-capital/radiant-v2'], defillama_slug: 'radiant', coingecko_id: 'radiant-capital', governance_type: 'snapshot', website: 'https://radiant.capital', treasury_addresses: {} },
  { id: 'treasure-dao', name: 'Treasure DAO', slug: 'treasure-dao', chain: 'arbitrum', category: 'gamefi', github_repos: ['TreasureProject/magicswapv2'], defillama_slug: 'treasure', coingecko_id: 'magic', governance_type: 'snapshot', website: 'https://treasure.lol', treasury_addresses: {} },
  { id: 'gains-network', name: 'Gains Network', slug: 'gains-network', chain: 'arbitrum', category: 'defi', github_repos: ['GainsNetwork/gTrade-contracts'], defillama_slug: 'gains-network', coingecko_id: 'gains-network', governance_type: 'none', website: 'https://gains.trade', treasury_addresses: {} },
  { id: 'jones-dao', name: 'Jones DAO', slug: 'jones-dao', chain: 'arbitrum', category: 'defi', github_repos: ['Jones-DAO/jaura-oracle'], defillama_slug: 'jones-dao', coingecko_id: 'jones-dao', governance_type: 'snapshot', website: 'https://jonesdao.io', treasury_addresses: {} },
  { id: 'dopex', name: 'Dopex', slug: 'dopex', chain: 'arbitrum', category: 'defi', github_repos: ['dopex-io/dopex-v2-clamm'], defillama_slug: 'dopex', coingecko_id: 'dopex', governance_type: 'snapshot', website: 'https://dopex.io', treasury_addresses: {} },
  { id: 'vertex', name: 'Vertex Protocol', slug: 'vertex', chain: 'arbitrum', category: 'defi', github_repos: ['vertex-protocol/vertex-contracts'], defillama_slug: 'vertex-protocol', coingecko_id: 'vertex-protocol', governance_type: 'none', website: 'https://vertexprotocol.com', treasury_addresses: {} },
  { id: 'vela', name: 'Vela Exchange', slug: 'vela', chain: 'arbitrum', category: 'defi', github_repos: ['VelaExchange/vela-exchange-contracts'], defillama_slug: 'vela-exchange', coingecko_id: 'vela-token', governance_type: 'none', website: 'https://vela.exchange', treasury_addresses: {} },
  { id: 'plutus-dao', name: 'Plutus DAO', slug: 'plutus-dao', chain: 'arbitrum', category: 'defi', github_repos: ['PlutusDAO/plsARB'], defillama_slug: 'plutus-dao', coingecko_id: 'plutus-dao', governance_type: 'snapshot', website: 'https://plutusdao.io', treasury_addresses: {} },
  { id: 'silo-finance', name: 'Silo Finance', slug: 'silo-finance', chain: 'arbitrum', category: 'defi', github_repos: ['silo-finance/silo-core-v1'], defillama_slug: 'silo-finance', coingecko_id: 'silo-finance', governance_type: 'snapshot', website: 'https://silo.finance', treasury_addresses: {} },
  { id: 'mux-protocol', name: 'MUX Protocol', slug: 'mux-protocol', chain: 'arbitrum', category: 'defi', github_repos: ['mux-world/mux-protocol'], defillama_slug: 'mux-protocol', coingecko_id: 'mux-protocol', governance_type: 'snapshot', website: 'https://mux.network', treasury_addresses: {} },
  { id: 'premia', name: 'Premia', slug: 'premia', chain: 'arbitrum', category: 'defi', github_repos: ['Premian-Labs/premia-v3-contracts'], defillama_slug: 'premia', coingecko_id: 'premia', governance_type: 'snapshot', website: 'https://premia.blue', treasury_addresses: {} },
  { id: 'pendle-arb', name: 'Pendle (Arbitrum)', slug: 'pendle-arb', chain: 'arbitrum', category: 'defi', github_repos: ['pendle-finance/pendle-core-v2-public'], defillama_slug: 'pendle', coingecko_id: 'pendle', governance_type: 'snapshot', website: 'https://pendle.finance', treasury_addresses: {} },
  { id: 'umami-finance', name: 'Umami Finance', slug: 'umami-finance', chain: 'arbitrum', category: 'defi', github_repos: ['UmamiDAO/umami-v2'], defillama_slug: 'umami-finance', coingecko_id: 'umami-finance', governance_type: 'snapshot', website: 'https://umami.finance', treasury_addresses: {} },
  { id: 'wormhole', name: 'Wormhole', slug: 'wormhole', chain: 'arbitrum', category: 'infrastructure', github_repos: ['wormhole-foundation/wormhole', 'wormhole-foundation/wormhole-sdk-ts'], defillama_slug: 'wormhole', coingecko_id: 'wormhole', governance_type: 'custom', website: 'https://wormhole.com', treasury_addresses: {} },
  { id: 'layerzero', name: 'LayerZero', slug: 'layerzero', chain: 'arbitrum', category: 'infrastructure', github_repos: ['LayerZero-Labs/LayerZero-v2', 'LayerZero-Labs/devtools'], defillama_slug: 'layerzero', coingecko_id: 'layerzero', governance_type: 'none', website: 'https://layerzero.network', treasury_addresses: {} },
  { id: 'synapse', name: 'Synapse', slug: 'synapse', chain: 'arbitrum', category: 'infrastructure', github_repos: ['synapsecns/synapse-contracts'], defillama_slug: 'synapse', coingecko_id: 'synapse-2', governance_type: 'snapshot', website: 'https://synapseprotocol.com', treasury_addresses: {} },

  // ── Optimism ──────────────────────────────────
  { id: 'optimism', name: 'Optimism', slug: 'optimism', chain: 'optimism', category: 'l1-l2', github_repos: ['ethereum-optimism/optimism'], defillama_slug: 'optimism', coingecko_id: 'optimism', governance_type: 'governor', website: 'https://optimism.io', treasury_addresses: {} },
  { id: 'velodrome', name: 'Velodrome', slug: 'velodrome', chain: 'optimism', category: 'defi', github_repos: ['velodrome-finance/contracts'], defillama_slug: 'velodrome', coingecko_id: 'velodrome-finance', governance_type: 'snapshot', website: 'https://velodrome.finance', treasury_addresses: {} },
  { id: 'synthetix', name: 'Synthetix', slug: 'synthetix', chain: 'optimism', category: 'defi', github_repos: ['Synthetixio/synthetix', 'Synthetixio/synthetix-v3'], defillama_slug: 'synthetix', coingecko_id: 'havven', governance_type: 'custom', website: 'https://synthetix.io', treasury_addresses: {} },

  // ── Solana ────────────────────────────────────
  { id: 'jupiter', name: 'Jupiter', slug: 'jupiter', chain: 'solana', category: 'defi', github_repos: ['jup-ag/jupiter-core'], defillama_slug: 'jupiter', coingecko_id: 'jupiter-exchange-solana', governance_type: 'snapshot', website: 'https://jup.ag', treasury_addresses: {} },
  { id: 'raydium', name: 'Raydium', slug: 'raydium', chain: 'solana', category: 'defi', github_repos: ['raydium-io/raydium-amm'], defillama_slug: 'raydium', coingecko_id: 'raydium', governance_type: 'none', website: 'https://raydium.io', treasury_addresses: {} },
  { id: 'marinade', name: 'Marinade Finance', slug: 'marinade', chain: 'solana', category: 'defi', github_repos: ['marinade-finance/liquid-staking-program'], defillama_slug: 'marinade-finance', coingecko_id: 'marinade', governance_type: 'custom', website: 'https://marinade.finance', treasury_addresses: {} },
  { id: 'stepn', name: 'STEPN', slug: 'stepn', chain: 'solana', category: 'socialfi', github_repos: [], defillama_slug: '', coingecko_id: 'stepn', governance_type: 'none', website: 'https://stepn.com', treasury_addresses: {} },

  // ── Cross-chain / Infrastructure ──────────────
  { id: 'stargate', name: 'Stargate', slug: 'stargate', chain: 'ethereum', category: 'infrastructure', github_repos: ['stargate-protocol/stargate-v2'], defillama_slug: 'stargate', coingecko_id: 'stargate-finance', governance_type: 'snapshot', website: 'https://stargate.finance', treasury_addresses: {} },
  { id: 'chainlink', name: 'Chainlink', slug: 'chainlink', chain: 'ethereum', category: 'infrastructure', github_repos: ['smartcontractkit/chainlink', 'smartcontractkit/ccip'], defillama_slug: '', coingecko_id: 'chainlink', governance_type: 'none', website: 'https://chain.link', treasury_addresses: {} },
  { id: 'the-graph', name: 'The Graph', slug: 'the-graph', chain: 'ethereum', category: 'infrastructure', github_repos: ['graphprotocol/graph-node', 'graphprotocol/graph-client'], defillama_slug: '', coingecko_id: 'the-graph', governance_type: 'governor', website: 'https://thegraph.com', treasury_addresses: {} },

  // ── Base ──────────────────────────────────────
  { id: 'aerodrome', name: 'Aerodrome', slug: 'aerodrome', chain: 'base', category: 'defi', github_repos: ['aerodrome-finance/contracts'], defillama_slug: 'aerodrome', coingecko_id: 'aerodrome-finance', governance_type: 'snapshot', website: 'https://aerodrome.finance', treasury_addresses: {} },

  // ── Cosmos ────────────────────────────────────
  { id: 'osmosis', name: 'Osmosis', slug: 'osmosis', chain: 'cosmos', category: 'defi', github_repos: ['osmosis-labs/osmosis'], defillama_slug: 'osmosis-dex', coingecko_id: 'osmosis', governance_type: 'cosmos-gov', website: 'https://osmosis.zone', treasury_addresses: {} },
];

export async function seedProjects(): Promise<void> {
  console.log(`Seeding ${SEED_PROJECTS.length} projects...`);

  for (const project of SEED_PROJECTS) {
    const { error } = await supabaseAdmin.from('projects').upsert(project);
    if (error) {
      console.error(`Error seeding ${project.name}:`, error);
    } else {
      console.log(`  Seeded: ${project.name}`);
    }
  }

  console.log('Seeding complete.');
}
