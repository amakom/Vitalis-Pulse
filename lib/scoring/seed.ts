import { supabaseAdmin } from '@/lib/supabase/server';

const SEED_PROJECTS = [
  { id: 'aave', name: 'Aave', slug: 'aave', chain: 'ethereum', category: 'defi', github_repos: ['aave/aave-v3-core', 'aave/interface'], defillama_slug: 'aave', coingecko_id: 'aave', governance_type: 'governor', website: 'https://aave.com', treasury_addresses: { ethereum: ['0x464C71f6c2F760DdA6093dCB91C24c39e5d6e18c'] } },
  { id: 'uniswap', name: 'Uniswap', slug: 'uniswap', chain: 'ethereum', category: 'defi', github_repos: ['Uniswap/v3-core', 'Uniswap/interface'], defillama_slug: 'uniswap', coingecko_id: 'uniswap', governance_type: 'governor', website: 'https://uniswap.org', treasury_addresses: { ethereum: ['0x1a9C8182C09F50C8318d769245beA52c32BE35BC'] } },
  { id: 'lido', name: 'Lido', slug: 'lido', chain: 'ethereum', category: 'defi', github_repos: ['lidofinance/lido-dao', 'lidofinance/core'], defillama_slug: 'lido', coingecko_id: 'lido-dao', governance_type: 'aragon', website: 'https://lido.fi', treasury_addresses: { ethereum: ['0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c'] } },
  { id: 'gmx', name: 'GMX', slug: 'gmx', chain: 'arbitrum', category: 'defi', github_repos: ['gmx-io/gmx-interface', 'gmx-io/gmx-synthetics'], defillama_slug: 'gmx', coingecko_id: 'gmx', governance_type: 'snapshot', website: 'https://gmx.io', treasury_addresses: {} },
  { id: 'arbitrum', name: 'Arbitrum', slug: 'arbitrum', chain: 'arbitrum', category: 'l1-l2', github_repos: ['OffchainLabs/nitro', 'ArbitrumFoundation/governance'], defillama_slug: 'arbitrum', coingecko_id: 'arbitrum', governance_type: 'governor', website: 'https://arbitrum.io', treasury_addresses: { arbitrum: ['0xF3FC178157fb3c87548bAA86F9d24BA38E649B58'] } },
  { id: 'optimism', name: 'Optimism', slug: 'optimism', chain: 'optimism', category: 'l1-l2', github_repos: ['ethereum-optimism/optimism'], defillama_slug: 'optimism', coingecko_id: 'optimism', governance_type: 'governor', website: 'https://optimism.io', treasury_addresses: {} },
  { id: 'jupiter', name: 'Jupiter', slug: 'jupiter', chain: 'solana', category: 'defi', github_repos: ['jup-ag/jupiter-core'], defillama_slug: 'jupiter', coingecko_id: 'jupiter-exchange-solana', governance_type: 'snapshot', website: 'https://jup.ag', treasury_addresses: {} },
  { id: 'raydium', name: 'Raydium', slug: 'raydium', chain: 'solana', category: 'defi', github_repos: ['raydium-io/raydium-amm'], defillama_slug: 'raydium', coingecko_id: 'raydium', governance_type: 'none', website: 'https://raydium.io', treasury_addresses: {} },
  { id: 'makerdao', name: 'MakerDAO', slug: 'makerdao', chain: 'ethereum', category: 'defi', github_repos: ['makerdao/dss', 'makerdao/governance-portal-v2'], defillama_slug: 'makerdao', coingecko_id: 'maker', governance_type: 'custom', website: 'https://makerdao.com', treasury_addresses: { ethereum: ['0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB'] } },
  { id: 'pendle', name: 'Pendle', slug: 'pendle', chain: 'ethereum', category: 'defi', github_repos: ['pendle-finance/pendle-core-v2-public'], defillama_slug: 'pendle', coingecko_id: 'pendle', governance_type: 'snapshot', website: 'https://pendle.finance', treasury_addresses: {} },
  { id: 'compound', name: 'Compound', slug: 'compound', chain: 'ethereum', category: 'defi', github_repos: ['compound-finance/compound-protocol', 'compound-finance/comet'], defillama_slug: 'compound-finance', coingecko_id: 'compound-governance-token', governance_type: 'governor', website: 'https://compound.finance', treasury_addresses: { ethereum: ['0x6d903f6003cca6255D85CcA4D3B5E5146dC33925'] } },
  { id: 'dydx', name: 'dYdX', slug: 'dydx', chain: 'ethereum', category: 'defi', github_repos: ['dydxprotocol/v4-chain'], defillama_slug: 'dydx', coingecko_id: 'dydx-chain', governance_type: 'cosmos-gov', website: 'https://dydx.exchange', treasury_addresses: {} },
  { id: 'sushiswap', name: 'SushiSwap', slug: 'sushiswap', chain: 'ethereum', category: 'defi', github_repos: ['sushiswap/sushiswap'], defillama_slug: 'sushi', coingecko_id: 'sushi', governance_type: 'snapshot', website: 'https://sushi.com', treasury_addresses: { ethereum: ['0xe94B5EEC1fA96CEecbD33EF5Baa8d00E4493F4f3'] } },
  { id: 'stargate', name: 'Stargate', slug: 'stargate', chain: 'ethereum', category: 'infrastructure', github_repos: ['stargate-protocol/stargate-v2'], defillama_slug: 'stargate', coingecko_id: 'stargate-finance', governance_type: 'snapshot', website: 'https://stargate.finance', treasury_addresses: {} },
  { id: 'treasure-dao', name: 'Treasure DAO', slug: 'treasure-dao', chain: 'arbitrum', category: 'gamefi', github_repos: ['TreasureProject/magicswapv2'], defillama_slug: 'treasure', coingecko_id: 'magic', governance_type: 'snapshot', website: 'https://treasure.lol', treasury_addresses: {} },
  { id: 'illuvium', name: 'Illuvium', slug: 'illuvium', chain: 'ethereum', category: 'gamefi', github_repos: [], defillama_slug: '', coingecko_id: 'illuvium', governance_type: 'snapshot', website: 'https://illuvium.io', treasury_addresses: {} },
  { id: 'osmosis', name: 'Osmosis', slug: 'osmosis', chain: 'cosmos', category: 'defi', github_repos: ['osmosis-labs/osmosis'], defillama_slug: 'osmosis-dex', coingecko_id: 'osmosis', governance_type: 'cosmos-gov', website: 'https://osmosis.zone', treasury_addresses: {} },
  { id: 'apecoin', name: 'ApeCoin DAO', slug: 'apecoin', chain: 'ethereum', category: 'dao', github_repos: ['apecoin/governance'], defillama_slug: '', coingecko_id: 'apecoin', governance_type: 'snapshot', website: 'https://apecoin.com', treasury_addresses: { ethereum: ['0xC5a3A1867184190C75F7Ad26B65B054cf9474568'] } },
  { id: 'looksrare', name: 'LooksRare', slug: 'looksrare', chain: 'ethereum', category: 'nft', github_repos: ['LooksRare/contracts-exchange-v2'], defillama_slug: 'looksrare', coingecko_id: 'looksrare', governance_type: 'none', website: 'https://looksrare.org', treasury_addresses: {} },
  { id: 'stepn', name: 'STEPN', slug: 'stepn', chain: 'solana', category: 'socialfi', github_repos: [], defillama_slug: '', coingecko_id: 'stepn', governance_type: 'none', website: 'https://stepn.com', treasury_addresses: {} },
];

export async function seedProjects(): Promise<void> {
  console.log('Seeding 20 projects...');

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
