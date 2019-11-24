#include "../dappservices/multi_index.hpp"
#include "../dappservices/log.hpp"
#include "../dappservices/oracle.hpp"
#include "../dappservices/cron.hpp"
#include "../dappservices/vaccounts.hpp"
#include "../dappservices/readfn.hpp"
#include "../dappservices/vcpu.hpp"
#include "../dappservices/multi_index.hpp"
#include <array>
#define DAPPSERVICES_ACTIONS() \
  XSIGNAL_DAPPSERVICE_ACTION \
  IPFS_DAPPSERVICE_ACTIONS \
  VACCOUNTS_DAPPSERVICE_ACTIONS \
  LOG_DAPPSERVICE_ACTIONS \
  CRON_DAPPSERVICE_ACTIONS \
  ORACLE_DAPPSERVICE_ACTIONS \
  VCPU_DAPPSERVICE_ACTIONS \
  READFN_DAPPSERVICE_ACTIONS
#define DAPPSERVICE_ACTIONS_COMMANDS() \
  IPFS_SVC_COMMANDS()ORACLE_SVC_COMMANDS()CRON_SVC_COMMANDS()VACCOUNTS_SVC_COMMANDS()LOG_SVC_COMMANDS()READFN_SVC_COMMANDS()VCPU_SVC_COMMANDS()
#define CONTRACT_NAME() vceipts
using std::string;
CONTRACT_START()


    TABLE stat {
        uint64_t   counter = 0;
    };

    typedef eosio::singleton<"stat"_n, stat> stats_def;
    bool timer_callback(name timer, std::vector<char> payload, uint32_t seconds){

        stats_def statstable(_self, _self.value);
        stat newstats;
        if(!statstable.exists()){
          statstable.set(newstats, _self);
        }
        else{
          newstats = statstable.get();
        }
        auto reschedule = false;
        if(newstats.counter++ < 3){
          reschedule = true;
        }
        statstable.set(newstats, _self);
        return reschedule;
        // reschedule

    }

    [[eosio::action]] void testschedule() {
        std::vector<char> payload;
        schedule_timer(_self, payload, 2);
    }

    struct document{
        name owner;
        string filename;
        string filedesc;
        string ipfsurl;
        EOSLIB_SERIALIZE( document, (owner)(filename)(filedesc)(ipfsurl) )
    };

    struct newreceipt {
        name to;
        name from;
        string linkid;
        string linkplatform;
        string terms;
        std::vector<document> docs;
        EOSLIB_SERIALIZE( newreceipt, (to)(from)(linkid)(linkplatform)(terms)(docs) )
    };

    struct deletevceipt {
        uint64_t id;
        uint64_t docid;
        name username;
        EOSLIB_SERIALIZE( deletevceipt, (id)(docid)(username) )
    };

    struct vceipt_list{
        name owner;
        vector<uint64_t> ids;
        EOSLIB_SERIALIZE( vceipt_list, (owner)(ids) )
    };

    struct [[eosio::table]] user_info {
        name    username;
        vceipt_list vceiptlist;
        auto primary_key() const { return username.value; }
    };

    struct [[eosio::table]] vceiptstable {
        uint64_t id;
        string linkid;
        string linkplatform;
        name to;
        name from;
        bool hasdocs;
        string terms;
        vector<uint64_t> docids;
        uint64_t primary_key()const { return id ; }
        name by_to_account()const { return to ; }
        name by_from_account()const { return from ; }
        uint64_t by_id()const { return id ; }
        string get_link_string()const {return (linkid + ":_:" + linkplatform);}
    };

    TABLE doclinks {
        uint64_t id;
        uint64_t vceiptid;
        string filename;
        string filedesc;
        string ipfslink;
        uint64_t primary_key()const { return id; }
    };

    TABLE account {
        extended_asset balance;
        uint64_t primary_key()const { return balance.contract.value; }
    };

    TABLE shardbucket {
        std::vector<char> shard_uri;
        uint64_t shard;
        uint64_t primary_key() const { return shard; }
    };

    typedef dapp::multi_index<"vctabs"_n, vceiptstable> vceipt_records_t;
    typedef eosio::multi_index<".vctabs"_n, vceiptstable> vceipt_records_t_v_abi;
    typedef eosio::multi_index<"vctabs"_n, shardbucket> vceipts_records_t_abi;

    typedef dapp::multi_index<"doclink"_n, doclinks> doclink_records_t;
    typedef eosio::multi_index<".doclink"_n, doclinks> doclink_records_t_v_abi;
    typedef eosio::multi_index<"doclink"_n, shardbucket> doclink_records_t_abi;
      
    typedef dapp::multi_index<"usertabs"_n, user_info> user_accounts_t;
    typedef eosio::multi_index<".usertabs"_n, user_info> user_accounts_t_v_abi;
    typedef eosio::multi_index<"usertabs"_n, shardbucket> user_accounts_t_abi;

    typedef dapp::multi_index<"vaccounts"_n, account> cold_accounts_t;
    typedef eosio::multi_index<".vaccounts"_n, account> cold_accounts_t_v_abi;
    typedef eosio::multi_index<"vaccounts"_n, shardbucket> cold_accounts_t_abi;


    [[eosio::action]] void dropvceipt(deletevceipt payload) {
        //require_auth(_self);
        drop_vceipt_record( _self, payload);
        //print("Completed Delete");
    }

    [[eosio::action]] void makereceipt(newreceipt payload) {
        //require_auth(payload.from);
        uint64_t newid = add_new_vceipt(payload.from, payload);
        print("{\"id\" : " + std::to_string(newid) + "}\n");
    }

    void transfer( name from,
                     name to,
                     asset        quantity,
                     string       memo ){
            require_auth(from);
            if(to != _self || from == _self || from == "eosio"_n || from == "eosio.stake"_n || from == to)
                return;
            if(memo == "seed transfer")
                return;
            if (memo.size() > 0){
                // name to_act = name(memo.c_str());
                // eosio::check(is_account(to_act), "The account name supplied is not valid");
                // require_recipient(to_act);
                // from = to_act;
                return;
            }
            extended_asset received(quantity, get_first_receiver());
            add_cold_balance(from, received);
    }

    

    private:
        void check_account(name acct){
            user_accounts_t usr_acts(_self, _self.value);
            auto to = usr_acts.find( acct.value );
            if( to == usr_acts.end() ) {
                vector<uint64_t> emptylist;
                vceipt_list vcl;
                vcl.owner = acct;
                vcl.ids = emptylist;
                usr_acts.emplace(_self, [&]( auto& a ){
                    a.username = acct;
                    a.vceiptlist = vcl;
                });
            }else{
            }
        }

        uint64_t add_new_vceipt(name owner, newreceipt payload){
            check_account(owner);
            user_accounts_t usr_acts(_self, _self.value);
            auto to = usr_acts.find( owner.value );
            vceipt_records_t vceipt_acts(_self, _self.value);

            //auto to = vceipt_acts.get_link_string( (payload.linkid + ":_:" + payload.linkplatform) );
            //if( to == vceipt_acts.end() ) {
            
            bool hdocs = false;
            uint64_t theid = -1;
            vceipt_acts.emplace(_self, [&]( auto& a ){
                a.id = vceipt_acts.available_primary_key();
                theid = a.id;
                a.linkid = payload.linkid;
                a.linkplatform = payload.linkplatform;
                a.to = payload.to;
                a.from = payload.from;
                a.terms = payload.terms;
                if(payload.docs.size() > 0){
                    a.hasdocs = true;
                    hdocs = true;
                }else{
                    a.hasdocs = false;
                }
                auto usr_vcpts = to -> vceiptlist.ids;
                usr_vcpts.insert(usr_vcpts.begin(), theid);
                usr_acts.modify( *to, _self, [&]( auto& b ) {
                    b.vceiptlist.ids = usr_vcpts;
              });
            });

            vector<uint64_t> docidlist;
            if(payload.docs.size() > 0){
                for(const auto& doc : payload.docs) {   // Range-for!
                    uint64_t anewd = add_new_doc(owner, doc, theid);
                    docidlist.insert(docidlist.begin(), anewd);
                }
            }
            auto va = vceipt_acts.find(theid);
            vceipt_acts.modify( *va, eosio::same_payer, [&]( auto& a ) {
                a.docids = docidlist;
              });
            return theid;
        }

         uint64_t add_new_doc(name owner, document payload, uint64_t vceiptid){
            doclink_records_t doc_recs(_self, _self.value);
            uint64_t theid = -1;
            doc_recs.emplace(_self, [&]( auto& a ){
                a.id = doc_recs.available_primary_key();
                theid = a.id;
                a.vceiptid = vceiptid;
                a.filename = payload.filename;
                a.filedesc = payload.filedesc;
                a.ipfslink = payload.ipfsurl;
            });
            return theid;
        }

        void drop_vceipt_record( name owner, deletevceipt payload){
            vceipt_records_t vceipt_acts(owner, owner.value);
            doclink_records_t doc_recs(owner, owner.value);
            user_accounts_t usr_acts(owner, owner.value);
            if(payload.id != -1){
                const auto& va = vceipt_acts.get( payload.id, "no vceipt found" );
                vceipt_acts.erase( va );
            }
            if(payload.docid != -1){
                const auto& dr = doc_recs.get( payload.docid, "no doc found" );
                doc_recs.erase( dr ); 
            }
            name testkill;
            if(payload.username.value != 1){
                const auto& us = usr_acts.get( payload.username.value, "no name found" );
                usr_acts.erase( us ); 
            }
        }


        void add_cold_balance( name owner, extended_asset value){
            cold_accounts_t to_acnts( _self, owner.value );
            auto to = to_acnts.find( value.contract.value );
            if( to == to_acnts.end() ) {
                to_acnts.emplace(_self, [&]( auto& a ){
                    a.balance = value;
                });
            } else {
                to_acnts.modify( *to, eosio::same_payer, [&]( auto& a ) {
                    a.balance += value;
                });
           }
      }

     VACCOUNTS_APPLY(((deletevceipt)(dropvceipt))((newreceipt)(makereceipt)))

};
EOSIO_DISPATCH_SVC_TRX(CONTRACT_NAME(), (dropvceipt)(makereceipt)(regaccount)(testschedule))